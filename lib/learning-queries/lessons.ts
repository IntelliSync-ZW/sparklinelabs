import { lessonSectionProjection, learningSeoProjection } from "./fragments";

// ---------------------------------------------------------------------------
// Lesson Queries
// ---------------------------------------------------------------------------

export const courseLessonBySlugQuery = `
  *[_type == "courseLesson" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    order,
    status,
    accessLevel,
    duration {
      value,
      unit
    },
    summary,
    learningOutcomes,
    "image": {
      "url": image.asset->url,
      "alt": image.alt,
      "caption": image.caption
    },
    videoUrl,
    transcript,
    "sections": body[defined(sections)].sections[] {
      ${lessonSectionProjection}
    },
    module-> {
      _id,
      title,
      "slug": slug.current,
      number,
      course-> {
        _id,
        title,
        "slug": slug.current
      }
    },
    "assessment": coalesce(
      assessment-> {
        _id,
        title,
        passingScore
      },
      *[_type == "courseAssessment" && lesson._ref == ^._id][0] {
        _id,
        title,
        passingScore
      }
    ),
    "tasks": coalesce(
      tasks[] {
        requirement,
        "task": task-> {
          _id,
          title,
          "slug": slug.current,
          taskType,
          instructions
        }
      },
      *[_type == "courseTask" && lesson._ref == ^._id] {
        "requirement": "optional",
        "task": {
          _id,
          title,
          "slug": slug.current,
          taskType,
          instructions
        }
      }
    ),
    ${learningSeoProjection}
  }
`;

export const allLessonSlugsQuery = `
  *[_type == "courseLesson" && defined(slug.current)] {
    "slug": slug.current,
    "courseSlug": module->course->slug.current,
    "moduleSlug": module->slug.current,
    _updatedAt
  }
`;

export const lessonsByModuleQuery = `
  *[_type == "courseLesson" && module._ref == $moduleId && status in $statuses] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    order,
    accessLevel,
    duration {
      value,
      unit
    },
    summary,
    "image": {
      "url": image.asset->url,
      "alt": image.alt
    }
  }
`;
