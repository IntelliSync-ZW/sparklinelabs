// ---------------------------------------------------------------------------
// Assessment & Task Queries
// ---------------------------------------------------------------------------

export const courseAssessmentByIdQuery = `
  *[_type == "courseAssessment" && _id == $id][0] {
    _id,
    title,
    assessmentType,
    instructions,
    passingScore,
    attemptLimit,
    randomiseQuestions,
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
`;

export const courseTaskByIdQuery = `
  *[_type == "courseTask" && _id == $id][0] {
    _id,
    title,
    "slug": slug.current,
    taskType,
    instructions,
    submissionFields,
    evaluationType,
    passingScore,
    correctRules
  }
`;
