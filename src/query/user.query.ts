export const USER_QUERY: {
    SELECT_USER: string;
    SELECT_USERS: string;
    CREATE_USER: string;
    DELETE_USER: string;
    UPDATE_USER: string;
    FIND_USER_BY_EMAIL: string
    GET_EMAIL_BY_EMAIL: string
    GET_USER_EXPERTISE: string
} = {
    SELECT_USERS: "SELECT * FROM user LIMIT 50",
    SELECT_USER: "SELECT * FROM user WHERE userId = ?",
    CREATE_USER: "INSERT INTO user (firstname, lastname, username, password, email) VALUES(?, ?, ?, ?, ?)",
    UPDATE_USER: "UPDATE user SET firstname = ?, lastname = ?, username = ?, password = ?, email = ? WHERE userId = ?",
    DELETE_USER: "DELETE FROM user WHERE userId = ?",
    FIND_USER_BY_EMAIL: "SELECT * FROM user WHERE email = ?",
    GET_EMAIL_BY_EMAIL: "SELECT email FROM user WHERE email = ?",
    GET_USER_EXPERTISE: "SELECT coding_tag.tagId, coding_tag.tagName, coding_tag.tagDescription FROM user_tag JOIN coding_tag ON coding_tag.tagId = user_tag.tagId WHERE user_tag.userId = ?"
};