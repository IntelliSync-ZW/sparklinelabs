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
    "lessons": *[_type == "courseLesson" && module._ref == ^._id && status == "published"] | order(order asc) {
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
    "sections": body[] {
      _key,
      title,
      "sectionId": sectionId.current,
      estimatedMinutes,
      ${contentProjection},
      "practice": select(defined(practice.source) => practice ${publicTaskSlot}),
      "check": select(defined(check.source) => check ${publicCheck})
    },
    "project": select(defined(project.source) => project ${publicTaskSlot}),
    "assessment": assessment-> { _id, title, passingScore },
    "resources": resources[]-> { _id, title, resourceType, description, url, "fileUrl": file.asset->url },
    "sources": sources[]-> { _id, title, publisher, url, sourceType, publishedDate },
    "module": module-> { _id, number, title, "slug": slug.current },
    "course": module->course-> {
      _id,
      title,
      "slug": slug.current,
      status,
      accessLevel,
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
    "lessons": *[_type == "courseLesson" && module._ref == ^._id && status == "published"] | order(order asc) {
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
    "sectionKeys": body[]._key,
    "sections": body[] {
      _key,
      "needsTask": defined(practice.source) && practice.required == true,
      "needsCheck": defined(check.source) && check.required == true
    },
    "projectRequired": defined(project.source) && project.required == true,
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
// SERVER ONLY — answer keys for grading. Never pass the result to a client component.
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
    "sections": body[] {
      _key,
      "practice": select(defined(practice.source) => practice ${answerKeyTaskSlot}),
      "check": select(defined(check.source) => check {
        required,
        "assessmentId": select(source == "library" => ref._ref),
        ...select(
          source == "library" => ref-> { passingScore, "questions": questions[] { ${answerKeyQuestion} } },
          { passingScore, "questions": questions[] { ${answerKeyQuestion} } }
        )
      })
    },
    "project": select(defined(project.source) => project ${answerKeyTaskSlot})
  }
`;

/** Published courses, modules and lessons — for the sitemap. */
export const learningSitemapQuery = `
  *[_type == "course" && status == "published" && defined(slug.current)] {
    "slug": slug.current,
    _updatedAt,
    "modules": *[_type == "courseModule" && course._ref == ^._id && defined(slug.current)] | order(number asc) {
      "slug": slug.current,
      "lessons": *[_type == "courseLesson" && module._ref == ^._id && status == "published" && defined(slug.current)] | order(order asc) {
        "slug": slug.current,
        _updatedAt
      }
    }
  }
`;
