import { INTRO_KEY } from "@/lib/learning/results";
import { learningSeoProjection } from "./fragments";

// ---------------------------------------------------------------------------
// Lesson player queries.
//
// The public projections NEVER include answer keys (correct answers, verdicts,
// explanations, model answers). Grading happens on the server using
// `lessonAnswerKeysQuery`, which must never be sent to the client.
//
// Ordering items and matching keys/options come back in their correct order.
// Always pass the result through `prepareLessonForClient` (lib/learning/prepare.ts),
// which shuffles them on the server before anything reaches the browser.
// ---------------------------------------------------------------------------

// A section's practice / check / the lesson project only count when the author
// added something: Studio pre-fills defaults (source, required, task type), so
// `defined(practice.source)` is true even for an untouched section.
const taskInUse = (slot: string) =>
  `((${slot}.source == "library" && defined(${slot}.ref)) || (!(${slot}.source == "library") && defined(${slot}.inline.title)))`;
const checkInUse = (slot: string) =>
  `((${slot}.source == "library" && defined(${slot}.ref)) || (!(${slot}.source == "library") && coalesce(count(${slot}.questions), 0) > 0))`;

// Progress, gating and grading work on one flat, ordered list of sections: the
// optional introduction (a field on the lesson, so it gets a fixed key), then every
// part's sections in order.
const lessonSections = `([select(count(introduction.content) > 0 => introduction {
  ...,
  "_key": "${INTRO_KEY}",
  "sectionId": { "current": "introduction" }
})] + body[defined(sections)].sections[])[defined(_key)]`;

/** Task fields safe to send to the browser. */
const publicTaskFields = `
  title,
  taskType,
  objective,
  estimatedMinutes,
  points,
  passingScore,
  context,
  steps[] { _key, title, detail },
  deliverable,
  classificationOptions,
  classificationColumns,
  classificationRows[] { _key, item },
  question,
  allowMultiple,
  choices[] { _key, label },
  matchColumns,
  "matchKeys": matchPairs[] { _key, key },
  "matchOptions": matchPairs[].option,
  "orderingItems": orderingItems,
  claims[] { _key, claim },
  starterPrompt,
  targetAiTool,
  wordRange,
  responsePlaceholder,
  checklistItems,
  rubric[] { _key, criterion, description },
  hints
`;

const publicTaskSlot = `{
  required,
  scored,
  "task": select(
    source == "library" => ref-> { "id": _id, ${publicTaskFields} },
    inline { ${publicTaskFields} }
  )
}`;

const publicQuestion = `
  _key,
  points,
  "question": question-> {
    _id,
    questionType,
    question,
    options[] { id, label },
    matchColumns,
    "matchKeys": matchPairs[] { _key, key },
    "matchOptions": matchPairs[].option
  }
`;

const publicCheck = `{
  required,
  scored,
  feedbackOnPass,
  feedbackOnFail,
  ...select(
    source == "library" => ref-> {
      "title": title,
      "passingScore": passingScore,
      "questions": questions[] { ${publicQuestion} }
    },
    {
      title,
      passingScore,
      "questions": questions[] { ${publicQuestion} }
    }
  )
}`;

const contentProjection = `
  content[] {
    ...,
    _type == "image" => {
      ...,
      "asset": asset->{ _id, url, metadata { dimensions, lqip } }
    },
    _type == "resourceBlock" => {
      note,
      "resource": resource-> { _id, title, resourceType, description, url, "fileUrl": file.asset->url }
    }
  }
`;

const curriculumProjection = `
  "modules": *[_type == "courseModule" && course._ref == ^._id] | order(number asc) {
    _id,
    number,
    title,
    "slug": slug.current,
    accessLevel,
    "lessons": *[_type == "courseLesson" && module._ref == ^._id && status in $statuses] | order(order asc) {
      _id,
      title,
      "slug": slug.current,
      lessonType,
      accessLevel,
      duration { value, unit }
    }
  }
`;

export const lessonPageQuery = `
  *[_type == "courseLesson"
    && slug.current == $lessonSlug
    && module->slug.current == $moduleSlug
    && module->course->slug.current == $courseSlug][0] {
    _id,
    title,
    "slug": slug.current,
    order,
    status,
    lessonType,
    accessLevel,
    duration { value, unit },
    summary,
    learningOutcomes,
    keyTakeaways,
    videoUrl,
    transcript,
    "image": { "url": image.asset->url, "alt": image.alt, "caption": image.caption },
    "sections": ${lessonSections} {
      _key,
      title,
      "sectionId": sectionId.current,
      estimatedMinutes,
      ${contentProjection},
      "practice": select(${taskInUse("practice")} => practice ${publicTaskSlot}),
      "check": select(${checkInUse("check")} => check ${publicCheck})
    },
    "parts": body[defined(sections)] { _key, title, intro, "sectionKeys": sections[]._key },
    "endAssessment": endAssessment {
      title,
      instructions,
      passingScore,
      "items": items[] {
        _key,
        _type,
        points,
        _type == "assessmentQuestionRef" => { ${publicQuestion} },
        _type == "assessmentTaskItem" => {
          "task": select(
            source == "library" => ref-> { "id": _id, ${publicTaskFields} },
            inline { ${publicTaskFields} }
          )
        }
      }
    },
    "resources": resources[]-> { _id, title, resourceType, description, url, "fileUrl": file.asset->url },
    "sources": sources[]-> { _id, title, publisher, url, sourceType, publishedDate },
    "module": module-> { _id, number, title, "slug": slug.current },
    "course": module->course-> {
      _id,
      title,
      "slug": slug.current,
      status,
      accessLevel,
      "noIndex": seo.noIndex,
      ${curriculumProjection}
    },
    ${learningSeoProjection}
  }
`;

/** Module overview page: module details plus the full course outline. */
export const moduleOverviewQuery = `
  *[_type == "courseModule"
    && slug.current == $moduleSlug
    && course->slug.current == $courseSlug][0] {
    _id,
    number,
    title,
    "slug": slug.current,
    description,
    accessLevel,
    "assessment": coalesce(
      moduleAssessment-> { _id, title, passingScore },
      *[_type == "courseAssessment" && module._ref == ^._id][0] { _id, title, passingScore }
    ),
    "lessons": *[_type == "courseLesson" && module._ref == ^._id && status in $statuses] | order(order asc) {
      _id,
      title,
      "slug": slug.current,
      lessonType,
      summary,
      duration { value, unit }
    },
    "course": course-> {
      _id,
      title,
      "slug": slug.current,
      status,
      accessLevel,
      "noIndex": seo.noIndex,
      ${curriculumProjection}
    }
  }
`;

/**
 * Everything the server needs to validate a progress update for a lesson:
 * its section keys and the course outline (for sequential unlocking).
 */
export const lessonProgressContextQuery = `
  *[_type == "courseLesson" && _id == $lessonId][0] {
    _id,
    "sectionKeys": ${lessonSections}._key,
    "sections": ${lessonSections} {
      _key,
      "needsTask": ${taskInUse("practice")} && practice.required == true,
      "needsCheck": ${checkInUse("check")} && check.required == true
    },
    "hasEndAssessment": coalesce(count(endAssessment.items), 0) > 0,
    "hasFinalAssessment": defined(module->course->finalAssessment),
    "course": module->course-> {
      _id,
      ${curriculumProjection}
    }
  }
`;

/** Course outline for the curriculum sidebar and module overview pages. */
export const courseCurriculumQuery = `
  *[_type == "course" && slug.current == $courseSlug][0] {
    _id,
    title,
    "slug": slug.current,
    accessLevel,
    ${curriculumProjection}
  }
`;

// ---------------------------------------------------------------------------
// SERVER ONLY - answer keys for grading. Never pass the result to a client component.
// ---------------------------------------------------------------------------

const answerKeyTaskFields = `
  taskType,
  points,
  passingScore,
  classificationRows[] { _key, correctAnswer, explanation },
  choices[] { _key, isCorrect, explanation },
  orderingItems,
  matchPairs[] { _key, option, explanation },
  claims[] { _key, verdict, explanation, sourceUrl },
  rubric[] { _key, criterion },
  checklistItems,
  wordRange,
  modelAnswer
`;

const answerKeyTaskSlot = `{
  required,
  "taskId": select(source == "library" => ref._ref),
  "task": select(
    source == "library" => ref-> { ${answerKeyTaskFields} },
    inline { ${answerKeyTaskFields} }
  )
}`;

const answerKeyQuestion = `
  _key,
  points,
  "question": question-> { _id, questionType, options[] { id, isCorrect, explanation }, matchPairs[] { _key, option, explanation }, correctAnswer, explanation }
`;

export const lessonAnswerKeysQuery = `
  *[_type == "courseLesson" && _id == $lessonId][0] {
    _id,
    "courseId": module->course._ref,
    "sections": ${lessonSections} {
      _key,
      "practice": select(${taskInUse("practice")} => practice ${answerKeyTaskSlot}),
      "check": select(${checkInUse("check")} => check {
        required,
        "assessmentId": select(source == "library" => ref._ref),
        ...select(
          source == "library" => ref-> { passingScore, "questions": questions[] { ${answerKeyQuestion} } },
          { passingScore, "questions": questions[] { ${answerKeyQuestion} } }
        )
      })
    },
    "endAssessment": endAssessment {
      passingScore,
      "items": items[] {
        _key,
        _type,
        points,
        _type == "assessmentQuestionRef" => { ${answerKeyQuestion} },
        _type == "assessmentTaskItem" => {
          "taskId": select(source == "library" => ref._ref),
          "task": select(
            source == "library" => ref-> { ${answerKeyTaskFields} },
            inline { ${answerKeyTaskFields} }
          )
        }
      }
    }
  }
`;

/**
 * Every scored item in a course, with its points, for the certificate score:
 * each lesson's end-of-lesson assessment, plus section tasks and checks that are
 * both required and marked scored.
 */
export const courseScoringQuery = `
  *[_type == "course" && _id == $courseId][0] {
    "minimumScore": completionRules.minimumAssessmentScore,
    "lessons": *[_type == "courseLesson" && module->course._ref == ^._id && status in $statuses] {
      _id,
      "sections": ${lessonSections} {
        _key,
        "task": select(${taskInUse("practice")} && practice.required == true && practice.scored == true => {
          "points": select(practice.source == "library" => practice.ref->points, practice.inline.points),
          "taskType": select(practice.source == "library" => practice.ref->taskType, practice.inline.taskType)
        }),
        "check": select(${checkInUse("check")} && check.required == true && check.scored == true => {
          "points": select(check.source == "library" => check.ref->questions[].points, check.questions[].points)
        })
      },
      "end": endAssessment {
        "items": items[] {
          _key,
          _type,
          points,
          "taskType": select(
            _type == "assessmentTaskItem" && source == "library" => ref->taskType,
            _type == "assessmentTaskItem" => inline.taskType
          )
        }
      }
    }
  }
`;

/**
 * Published, indexable courses, modules and lessons - for the sitemap.
 * A noIndex course drops its modules and lessons with it; a noIndex lesson
 * drops only itself. Modules have no SEO settings, so they follow their course.
 */
export const learningSitemapQuery = `
  *[_type == "course" && status == "published" && defined(slug.current) && seo.noIndex != true] {
    "slug": slug.current,
    _updatedAt,
    "modules": *[_type == "courseModule" && course._ref == ^._id && defined(slug.current)] | order(number asc) {
      "slug": slug.current,
      "lessons": *[_type == "courseLesson" && module._ref == ^._id && status == "published" && defined(slug.current) && seo.noIndex != true] | order(order asc) {
        "slug": slug.current,
        _updatedAt
      }
    }
  }
`;

/** What the server needs to decide on and issue a course certificate. */
export const certificateCourseQuery = `
  *[_type == "course" && _id == $courseId][0] {
    _id,
    title,
    "slug": slug.current,
    status,
    certificate { enabled, priceUsd, certificateTitle },
    "minimumScore": completionRules.minimumAssessmentScore,
    ${curriculumProjection}
  }
`;
