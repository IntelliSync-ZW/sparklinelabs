// One-off content migration for two schema changes on courseLesson:
//   1. `body` holds lessonPart items (each with a heading and `sections`) instead of
//      lessonSection items. Existing sections move into one part titled after the
//      lesson; rename or split it in Studio afterwards. Section _keys are kept, so
//      learner progress (keyed by section _key) carries over.
//   2. checkpointBlock holds `questions[]` instead of a single question/options.
// Published documents and drafts are both migrated. Writes by default; pass
// --dry-run to only list what would change. Safe to re-run: documents already in
// the new shape are left alone.
// Run: pnpm exec tsx scripts/sanity-lesson-parts.ts [--dry-run]
import "dotenv/config";
import { randomUUID } from "node:crypto";
import { createClient } from "next-sanity";

const dryRun = process.argv.includes("--dry-run");
const token = process.env.SANITY_API_TOKEN;
if (!token) throw new Error("Missing SANITY_API_TOKEN");

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
  perspective: "raw",
});

type Item = { _type?: string; _key?: string; [field: string]: unknown };
type Lesson = { _id: string; _rev: string; title?: string; body?: Item[] | null };

const newKey = () => randomUUID().replace(/-/g, "").slice(0, 12);

/** Old single-question checkpoint → one-question `questions[]`. */
function migrateCheckpoint(block: Item): Item {
  if (block._type !== "checkpointBlock" || Array.isArray(block.questions)) return block;
  const { question, answerType, options, ...rest } = block;
  const correct = Array.isArray(options) ? options.filter((o: { isCorrect?: boolean }) => o?.isCorrect).length : 0;
  return {
    ...rest,
    questions: [
      {
        _type: "checkpointQuestion",
        _key: newKey(),
        question,
        answerType: answerType ?? (correct > 1 ? "multiple" : "single"),
        options,
      },
    ],
  };
}

function migrateSection(section: Item): Item {
  if (!Array.isArray(section.content)) return section;
  return { ...section, content: (section.content as Item[]).map(migrateCheckpoint) };
}

function migrateBody(lesson: Lesson): Item[] | null {
  const body = lesson.body ?? [];
  const loose = body.filter((item) => item._type === "lessonSection");
  const parts = body.filter((item) => item._type === "lessonPart");
  if (loose.length > 0 && parts.length > 0) {
    throw new Error(`${lesson._id}: body mixes sections and parts; fix it by hand in Studio`);
  }

  const next: Item[] =
    loose.length > 0
      ? [{ _type: "lessonPart", _key: newKey(), title: lesson.title ?? "Part 1", sections: loose.map(migrateSection) }]
      : parts.map((part) => ({ ...part, sections: ((part.sections as Item[] | undefined) ?? []).map(migrateSection) }));

  return JSON.stringify(next) === JSON.stringify(body) ? null : next;
}

const lessons = await client.fetch<Lesson[]>(`*[_type == "courseLesson"] { _id, _rev, title, body }`);
const tx = client.transaction();
let changed = 0;

for (const lesson of lessons) {
  const body = migrateBody(lesson);
  if (!body) {
    console.log(`  unchanged  ${lesson._id}`);
    continue;
  }
  changed++;
  const sections = body.flatMap((part) => (part.sections as Item[] | undefined) ?? []);
  console.log(`  migrate    ${lesson._id}  "${lesson.title}"  ${body.length} part(s), ${sections.length} section(s)`);
  tx.patch(lesson._id, (patch) => patch.ifRevisionId(lesson._rev).set({ body }));
}

if (changed === 0) {
  console.log("Nothing to migrate.");
} else if (dryRun) {
  console.log(`\nDry run: ${changed} document(s) would change. Re-run without --dry-run to write them.`);
} else {
  await tx.commit();
  console.log(`\nMigrated ${changed} document(s). Rename each new part in Studio.`);
}
