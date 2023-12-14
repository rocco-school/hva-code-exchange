export const QUESTION_QUERY: {
    SELECT_QUESTIONS: string;
    SELECT_RECENT_FIVE_QUESTIONS: string;
    SELECT_QUESTION: string;
    CREATE_QUESTION: string;
    UPDATE_QUESTION: string;
    DELETE_QUESTION: string;

} = {
    SELECT_QUESTIONS: "SELECT * FROM question LIMIT 50",
    SELECT_RECENT_FIVE_QUESTIONS: "SELECT * FROM question ORDER BY updatedAt DESC LIMIT 5",
    SELECT_QUESTION: "SELECT * FROM question WHERE questionId = ?",
    CREATE_QUESTION: "INSERT INTO question (userId, questionTitle, questionBody, isClosed) VALUES(?, ?, ?, ?)",
    UPDATE_QUESTION: "UPDATE question SET questionTitle = ?, questionBody = ?, isClosed = ? WHERE questionId = ?",
    DELETE_QUESTION: "DELETE FROM question WHERE questionId = ?",
};