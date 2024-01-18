export const ANSWER_QUERY: {
    SELECT_ANSWERS: string;
    SELECT_ANSWER: string;
    CREATE_ANSWER: string;
    UPDATE_ANSWER: string;
    DELETE_ANSWER: string;
    GET_ANSWERS_FROM_QUESTION: string;
    GET_ANSWERS_AND_USERS_FROM_QUESTION: string;
    GET_TOTAL_ANSWERS_BY_USER: string
    COUNT_ANSWERS_FROM_QUESTION: string;
    UPDATE_TOTAL_UPVOTES: string;
    UPDATE_TOTAL_DOWNVOTES: string;
} = {
    SELECT_ANSWERS: "SELECT * FROM answer LIMIT 50",
    SELECT_ANSWER: "SELECT * FROM answer WHERE answerId = ?",
    CREATE_ANSWER: "INSERT INTO answer (questionId, userId, answerBody) VALUES(?, ?, ?)",
    UPDATE_ANSWER: "UPDATE answer SET answerBody = ?, isAccepted = ? WHERE answerId = ? ",
    DELETE_ANSWER: "DELETE FROM answer WHERE answerId = ?",
    GET_ANSWERS_FROM_QUESTION: "SELECT * FROM answer WHERE questionId = ?",
    GET_ANSWERS_AND_USERS_FROM_QUESTION: "SELECT answer.answerId, answer.questionId, answer.answerBody, answer.totalUpvotes, answer.totalDownvotes, answer.isAccepted, answer.createdAt, answer.updatedAt, user.userId, user.firstname, user.lastname FROM answer LEFT JOIN user ON user.userId = answer.userId WHERE questionId = ? ORDER BY answer.createdAt DESC",
    GET_TOTAL_ANSWERS_BY_USER: "SELECT COUNT(answerId) as totalAnswers FROM answer WHERE userId = ?",
    COUNT_ANSWERS_FROM_QUESTION: "SELECT COUNT(*) AS answerCount FROM answer WHERE questionId = ?",
    UPDATE_TOTAL_UPVOTES: "UPDATE answer SET totalUpvotes = totalUpvotes + ? WHERE answerId = ?",
    UPDATE_TOTAL_DOWNVOTES: "UPDATE answer SET totalDownvotes = totalDownvotes + ? WHERE answerId = ?",
};