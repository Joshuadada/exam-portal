export type SubmitType = {
    examId: string,
    studentId: string,
    answers: {
        subQuestionId: string,
        answerText: string
      }[]
  }