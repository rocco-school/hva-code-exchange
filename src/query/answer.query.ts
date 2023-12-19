export const ANSWER_QUERY: {
    SELECT_ANSWERS: string;
    SELECT_ANSWER: string;
    CREATE_ANSWER: string;
    UPDATE_ANSWER: string;
    DELETE_ANSWER: string;
    GET_ANSWERS_FROM_QUESTION: string;
} = {
    SELECT_ANSWERS: "SELECT * FROM answer LIMIT 50",
    SELECT_ANSWER: "SELECT * FROM answer WHERE answerId = ?",
    CREATE_ANSWER: "INSERT INTO answer (questionId, userId, answerBody) VALUES(?, ?, ?)",
    UPDATE_ANSWER: "UPDATE answer SET answerBody = ? WHERE answerId = ? ",
    DELETE_ANSWER: "DELETE FROM answer WHERE answerId = ?",
    GET_ANSWERS_FROM_QUESTION: "SELECT * FROM answer WHERE questionId = ?",
};