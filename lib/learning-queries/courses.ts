import { learningHeroImageProjection, learningSeoProjection } from "./fragments";

// ---------------------------------------------------------------------------
// Course Queries
// ---------------------------------------------------------------------------

export const allCoursesQuery = `
  *[_type == "course" && status == "published"] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    status,
    accessLevel,
    shortDescription,
    durationMinutes,
    level,
    heroImage {
      "url": asset->url,
      alt
    },
    certificate {
      enabled,
      priceUsd,
      certificateTitle
    },
    "modules": *[_type == "courseModule" && (course._ref == ^._id || _id in ^.modules[]._ref)] | order(number asc) {
      _id,
      number,
      title,
      "slug": slug.current,
      "lessons": *[_type == "courseLesson" && (module._ref == ^._id || _id in ^.lessons[]._ref)] | order(order asc) {
        _id,
        order,
        title,
        "slug": slug.current,
        accessLevel,
        duration {
          value,
          unit
        }
      }
    }
  }
`;

export const courseBySlugQuery = `
  *[_type == "course" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    status,
    accessLevel,
    shortDescription,
    description,
    level,
    durationMinutes,
    outcomes,
    ${learningHeroImageProjection},
    certificate {
      enabled,
      priceUsd,
      certificateTitle
    },
    completionRules {
      minimumAssessmentScore,
      allLessonsRequired,
      allRequiredTasksPassed
    },
    "modules": *[_type == "courseModule" && (course._ref == ^._id || _id in ^.modules[]._ref)] | order(number asc) {
      _id,
      number,
      title,
      "slug": slug.current,
      description,
      "lessons": *[_type == "courseLesson" && (module._ref == ^._id || _id in ^.lessons[]._ref)] | order(order asc) {
        _id,
        order,
        title,
        "slug": slug.current,
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
      },
      "moduleAssessment": coalesce(
        moduleAssessment-> {
          _id,
          title,
          passingScore
        },
        *[_type == "courseAssessment" && module._ref == ^._id][0] {
          _id,
          title,
          passingScore
        }
      )
    },
    "finalAssessment": coalesce(
      finalAssessment-> {
        _id,
        title,
        passingScore
      },
      *[_type == "courseAssessment" && course._ref == ^._id && assessmentType == "final"][0] {
        _id,
        title,
        passingScore
      }
    ),
    ${learningSeoProjection}
  }
`;

export const allCourseSlugsQuery = `
  *[_type == "course" && defined(slug.current)] {
    "slug": slug.current,
    _updatedAt
  }
`;

export const featuredCoursesQuery = `
  *[_type == "course" && status == "published"][0...3] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    accessLevel,
    shortDescription,
    level,
    durationMinutes,
    heroImage {
      "url": asset->url,
      alt
    }
  }
`;
