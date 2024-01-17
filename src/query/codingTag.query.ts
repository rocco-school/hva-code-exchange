export const CODING_TAG_QUERY: {
    SELECT_CODING_TAGS: string;
    SELECT_CODING_TAG: string;
    CREATE_CODING_TAG: string;
    SELECT_CODING_TAG_NAME: string;
    UPDATE_CODING_TAG: string;
    DELETE_CODING_TAG: string;
    GET_CODING_TAGS_BY_QUESTION_ID: string;
    DELETE_ALL_QUESTION_TAGS_BY_QUESTION_ID: string;
} = {
    SELECT_CODING_TAGS: "SELECT * FROM coding_tag LIMIT 50",
    SELECT_CODING_TAG: "SELECT * FROM coding_tag WHERE tagId = ?",
    SELECT_CODING_TAG_NAME: "SELECT tagName FROM coding_tag WHERE tagId = ?",
    CREATE_CODING_TAG: "INSERT INTO coding_tag (tagName, tagDescription) VALUES(?, ?)",
    UPDATE_CODING_TAG: "UPDATE coding_tag SET tagName = ?, tagDescription = ? WHERE tagId = ?",
    DELETE_CODING_TAG: "DELETE FROM coding_tag WHERE tagId = ?",
    GET_CODING_TAGS_BY_QUESTION_ID: "SELECT * FROM question_tag WHERE questionId = ?",
    DELETE_ALL_QUESTION_TAGS_BY_QUESTION_ID: "DELETE FROM question_tag WHERE questionId = ?",
};