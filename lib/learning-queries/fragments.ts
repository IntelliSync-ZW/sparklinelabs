// ---------------------------------------------------------------------------
// Reusable Learning & Course Projections
// ---------------------------------------------------------------------------

export const learningSeoProjection = `"seo": seo { title, description, "ogImage": ogImage.asset->url }`;

export const learningHeroImageProjection = `"heroImage": { "url": heroImage.asset->url, "alt": heroImage.alt }`;

export const lessonSectionProjection = `
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
    _type == "sectionTask" => {
      ...,
      taskRef-> {
        _id,
        title,
        "slug": slug.current,
        taskType,
        instructions,
        evaluationType,
        passingScore,
        classificationInstruction,
        classificationOptions,
        classificationColumns,
        classificationRows
      }
    },
    _type == "lessonTaskRef" => {
      ...,
      task-> {
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
    _type == "sectionAssessment" => {
      ...,
      assessmentRef-> {
        _id,
        title,
        passingScore,
        questions[] {
          points,
          question-> {
            _id,
            questionType,
            question,
            options,
            correctAnswer,
            explanation
          }
        }
      },
      questions[] {
        points,
        question-> {
          _id,
          questionType,
          question,
          options,
          correctAnswer,
          explanation
        }
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
        evaluationType,
        passingScore,
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
      evaluationType,
      passingScore,
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
        _id,
        title,
        passingScore,
        questions[] {
          points,
          question-> {
            _id,
            questionType,
            question,
            options,
            correctAnswer,
            explanation
          }
        }
      },
      questions[] {
        points,
        question-> {
          _id,
          questionType,
          question,
          options,
          correctAnswer,
          explanation
        }
      }
    },
    _type == "reference" => @-> {
      _id,
      title,
      passingScore,
      questions[] {
        points,
        question-> {
          _id,
          questionType,
          question,
          options,
          correctAnswer,
          explanation
        }
      }
    }
  }
`;
