export const ANSWER_QUERY: {
    COUNT_ANSWERS_FROM_QUESTION: string;
} = {
    COUNT_ANSWERS_FROM_QUESTION: "SELECT COUNT(*) AS answerCount FROM answer WHERE questionId = ?"
};