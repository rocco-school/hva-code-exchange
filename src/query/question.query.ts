export const QUESTION_QUERY: {
    SELECT_QUESTIONS: string;
    SELECT_QUESTION: string;
    CREATE_QUESTION: string;
    UPDATE_QUESTION: string;
    DELETE_QUESTION: string;

} = {
    SELECT_QUESTIONS: "SELECT * FROM question LIMIT 50",
    SELECT_QUESTION: "SELECT * FROM question WHERE question_id = ?",
    CREATE_QUESTION: "INSERT INTO question (user_id, title, body, is_closed) VALUES(?, ?, ?, ?)",
    UPDATE_QUESTION: "UPDATE question SET title = ?, body = ?, is_closed = ? WHERE question_id = ?",
    DELETE_QUESTION: "DELETE FROM question WHERE question_id = ?",
};