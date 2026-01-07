export type ResultSummaryType = {
    submissionId: string,
    submissionDate: string,
    totalScore: number,
    studentScore: number,
    examId: number,
    examTitle: string,
    courseCode: string,
    percentage: number,
    grade: string,
    status: string,
}

export type ResultType = {
    studentId: string,
    submissionId: string,
    courseCode: string,
    examTitle: string,
    studentTotalScore: number,
    totalMaxScore: number,
    percentage: number,
    grade: string,
    status: string,
    questions: {
        questionId: string,
        number: number,
        subQuestions: {
            subQuestionId: string,
            questionText: string,
            answerText: string,
            label: string,
            markingGuide: string,
            feedback: string,
            awardedMark: number,
            maxMark: number,
            weaknesses: string[],
            strength: string[]
        }[]
    }[]
}

export type LecturerResultSummaryType = {
    examId: string,
    submissionId: string,
    studentId: string,
    creatorId: string,
    examTitle: string,
    courseCode: string,
    examDate: string,
    totalScore: string,
    studentScore: string,
    fullName: string,
    identity: string,
    percentage: number,
    grade: string,
    status: string
}

export type LecturerResultType = {
    studentId: string,
    submissionId: string,
    courseCode: string,
    examTitle: string,
    examDate: string,
    examDuration: number,
    identity: string,
    studentName: string,
    studentDepartment: string,
    studentTotalScore: number,
    totalMaxScore: number,
    percentage: number,
    grade: string,
    status: string,
    questions: {
        questionId: string,
        number: number,
        subQuestions: {
            subQuestionId: string,
            questionText: string,
            answerText: string,
            label: string,
            markingGuide: string,
            feedback: string,
            awardedMark: number,
            maxMark: number,
            strength: string[],
            weaknesses: string[]
        }[]
    }[]
}