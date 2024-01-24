export const QUESTION_QUERY: {
    SELECT_QUESTIONS: string;
    SELECT_RECENT_FIVE_QUESTIONS: string;
    SELECT_QUESTION_TAG: string;
    SELECT_QUESTION_BY_ANSWER_ID: string;
    SELECT_QUESTION: string;
    CREATE_QUESTION: string;
    UPDATE_QUESTION: string;
    DELETE_QUESTION: string;
    CREATE_QUESTION_TAG: string;
    GET_TOTAL_QUESTIONS_BY_USER: string;
    UPDATE_TOTAL_UPVOTES: string;
    UPDATE_TOTAL_DOWNVOTES: string;
    GET_QUESTIONS_BY_USER: string;
    GET_RECENT_QUESTIONS_BY_USER: string;
    GET_MAX_QUESTION_PAGES: string;
    GET_QUESTION_BY_PAGE_NUMBER: string;
    COUNT_QUESTIONS: string;
} = {
    SELECT_QUESTIONS: "SELECT * FROM question LIMIT 50",
    SELECT_RECENT_FIVE_QUESTIONS: "SELECT * FROM question ORDER BY updatedAt DESC LIMIT 5",
    SELECT_QUESTION_TAG: "SELECT question.questionId, question_tag.tagId, coding_tag.tagName FROM ((question JOIN question_tag ON question.questionId = question_tag.questionId) JOIN coding_tag ON question_tag.tagId = coding_tag.tagId) WHERE question.questionId = ?",
    SELECT_QUESTION_BY_ANSWER_ID: "SELECT question.questionId, question.questionTitle FROM answer JOIN question ON answer.questionId = question.questionId WHERE answer.userId = ?",
    SELECT_QUESTION: "SELECT * FROM question WHERE questionId = ?",
    CREATE_QUESTION: "INSERT INTO question (userId, questionTitle, questionBody, isClosed) VALUES(?, ?, ?, ?)",
    UPDATE_QUESTION: "UPDATE question SET userId = ?, questionTitle = ?, questionBody = ?, isClosed = ? WHERE questionId = ?",
    DELETE_QUESTION: "DELETE FROM question WHERE questionId = ?",
    CREATE_QUESTION_TAG: "INSERT INTO question_tag (questionId, tagId) VALUES(?, ?)",
    GET_TOTAL_QUESTIONS_BY_USER: "SELECT COUNT(questionId) as totalQuestions FROM question WHERE userId = ?",
    UPDATE_TOTAL_UPVOTES: "UPDATE question SET totalUpvotes = totalUpvotes + ? WHERE questionId = ?",
    UPDATE_TOTAL_DOWNVOTES: "UPDATE question SET totalDownvotes = totalDownvotes + ? WHERE questionId = ?",
    GET_QUESTIONS_BY_USER: "SELECT * FROM question WHERE userId = ?",
    GET_RECENT_QUESTIONS_BY_USER: "SELECT * FROM question WHERE userId = ? ORDER BY createdAt DESC",
    GET_MAX_QUESTION_PAGES: "SELECT CEIL(COUNT(*) / ?) AS max_pages FROM question",
    GET_QUESTION_BY_PAGE_NUMBER: "SELECT * FROM question ORDER BY questionId LIMIT ? OFFSET ?",
    COUNT_QUESTIONS: "SELECT COUNT(*) AS rowCount FROM question"
};