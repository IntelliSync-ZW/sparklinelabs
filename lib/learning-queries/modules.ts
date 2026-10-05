import { learningSeoProjection } from "./fragments";

// ---------------------------------------------------------------------------
// Module Queries
// ---------------------------------------------------------------------------

export const courseModuleBySlugQuery = `
  *[_type == "courseModule" && slug.current == $slug][0] {
    _id,
    number,
    title,
    "slug": slug.current,
    description,
    accessLevel,
    course-> {
      _id,
      title,
      "slug": slug.current
    },
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
    ),
    ${learningSeoProjection}
  }
`;

export const allModulesQuery = `
  *[_type == "courseModule"] | order(number asc) {
    _id,
    number,
    title,
    "slug": slug.current,
    accessLevel,
    course-> {
      _id,
      title,
      "slug": slug.current
    }
  }
`;

export const moduleWithLessonsBySlugQuery = `
  *[_type == "courseModule" && slug.current == $moduleSlug && course->slug.current == $courseSlug][0] {
    _id,
    number,
    title,
    "slug": slug.current,
    description,
    accessLevel,
    course-> {
      _id,
      title,
      "slug": slug.current,
      accessLevel,
      certificate {
        enabled,
        priceUsd,
        certificateTitle
      },
      "allModules": *[_type == "courseModule" && (course._ref == ^._id || _id in ^.modules[]._ref)] | order(number asc) {
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
    },
    "lessons": *[_type == "courseLesson" && (module._ref == ^._id || _id in ^.lessons[]._ref)] | order(order asc) {
      _id,
      order,
      title,
      "slug": slug.current,
      status,
      accessLevel,
      duration {
        value,
        unit
      },
      summary,
      learningOutcomes,
      videoUrl,
      "image": {
        "url": image.asset->url,
        "alt": image.alt,
        "caption": image.caption
      },
      "sections": body[] {
        _key,
        title,
        "sectionId": sectionId.current,
        order,
        defaultOpen,
        duration {
          value,
          unit
        },
        progression {
          required,
          completionType
        },
        content[] {
          ...,
          _type == "image" => {
            ...,
            "asset": asset->{ _id, url, metadata }
          },
          _type == "stlTableBlock" => {
            ...,
            stlParsed,
            stlString
          },
          _type == "sectionAssessment" => {
            ...,
            assessmentRef-> {
              _id, title, passingScore,
              questions[] {
                points,
                question-> { _id, questionType, question, options, correctAnswer, explanation }
              }
            },
            questions[] {
              points,
              question-> { _id, questionType, question, options, correctAnswer, explanation }
            }
          }
        },
        task[] {
          ...,
          _type == "sectionTask" => {
            ...,
            taskRef-> {
              _id,
              title,
              "slug": slug.current,
              taskType,
              instructions,
              classificationInstruction,
              classificationOptions,
              classificationColumns,
              classificationRows
            }
          },
          _type == "reference" => @-> {
            _id,
            title,
            "slug": slug.current,
            taskType,
            instructions,
            classificationInstruction,
            classificationOptions,
            classificationColumns,
            classificationRows
          }
        },
        assessment[] {
          ...,
          _type == "sectionAssessment" => {
            ...,
            assessmentRef-> {
              _id, title, passingScore,
              questions[] {
                points,
                question-> { _id, questionType, question, options, correctAnswer, explanation }
              }
            },
            questions[] {
              points,
              question-> { _id, questionType, question, options, correctAnswer, explanation }
            }
          },
          _type == "reference" => @-> {
            _id, title, passingScore,
            questions[] {
              points,
              question-> { _id, questionType, question, options, correctAnswer, explanation }
            }
          }
        }
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
  }
`;
