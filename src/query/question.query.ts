export const QUESTION_QUERY: {
    SELECT_QUESTIONS: string;
    SELECT_QUESTION: string;
    CREATE_QUESTION: string;
    UPDATE_QUESTION: string;
    DELETE_QUESTION: string;
    CREATE_QUESTION_TAG: string;
    GET_TOTAL_QUESTIONS_BY_USER: string;
} = {
    SELECT_QUESTIONS: "SELECT * FROM question LIMIT 50",
    SELECT_QUESTION: "SELECT * FROM question WHERE questionId = ?",
    CREATE_QUESTION: "INSERT INTO question (userId, questionTitle, questionBody, isClosed) VALUES(?, ?, ?, ?)",
    UPDATE_QUESTION: "UPDATE question SET questionTitle = ?, questionBody = ?, isClosed = ? WHERE questionId = ?",
    DELETE_QUESTION: "DELETE FROM question WHERE questionId = ?",
    CREATE_QUESTION_TAG: "INSERT INTO question_tag (questionId, tagId) VALUES(?, ?)",
    GET_TOTAL_QUESTIONS_BY_USER: "SELECT COUNT(questionId) as totalQuestions FROM question WHERE userId = ?",
};