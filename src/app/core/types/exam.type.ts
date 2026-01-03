export type ExamType = {
    id: string;
    title: string;
    courseCode: string;
    creatorId: string;
    examinerName: string;
    duration: number;
    examDate: string;
    totalMarks: number;
    createdAt: string;
}

export type CreateExamType = {
    title: string,
    courseCode: string,
    creatorId: string,
    examinerName: string,
    instructions: string,
    duration: number,
    questions: {
        number: number,
        subQuestions: {
            label: string,
            questionText: string,
            marks: number,
            markingGuide: string
        }[]
    }[],
    examDate: string
}