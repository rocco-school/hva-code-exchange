export const USER_QUERY: {
    SELECT_USER: string;
    SELECT_USERS: string;
    SELECT_TAGS_BY_USER: string;
    CREATE_USER: string;
    DELETE_USER: string;
    UPDATE_USER: string;
    UPDATE_USER_TAG: string;
    CREATE_USER_TAG: string;
    UPDATE_PASSWORD: string;
    FIND_USER_BY_EMAIL: string;
    GET_EMAIL_BY_EMAIL: string;
    GET_TAG: string;
    GET_TAGS: string;
} = {
    SELECT_USERS: "SELECT * FROM user LIMIT 50",
    SELECT_USER: "SELECT * FROM user WHERE userId = ?",
    SELECT_TAGS_BY_USER: "SELECT user.userId, user_tag.tagId, coding_tag.tagName FROM ((user JOIN user_tag ON user.userId = user_tag.userId) JOIN coding_tag ON user_tag.tagId = coding_tag.tagId) WHERE user.userId = ?",
    CREATE_USER: "INSERT INTO user (firstname, lastname, username, password, email) VALUES(?, ?, ?, ?, ?)",
    UPDATE_USER: "UPDATE user SET firstname = ?, lastname = ?, dateOfBirth = ?, username = ?, experienceYears = ?, email = ? WHERE userId = ?",
    UPDATE_USER_TAG: "UPDATE user_tag SET tagId = ? WHERE userId = ?",
    CREATE_USER_TAG: "INSERT INTO user_tag (userId, tagId) VALUES(?, ?)",
    UPDATE_PASSWORD: "UPDATE user SET password = ? WHERE userId = ?",
    DELETE_USER: "DELETE FROM user WHERE userId = ?",
    FIND_USER_BY_EMAIL: "SELECT * FROM user WHERE email = ?",
    GET_EMAIL_BY_EMAIL: "SELECT email FROM user WHERE email = ?",
    GET_TAG: "SELECT tagId FROM coding_tag WHERE tagName = ?",
    GET_TAGS: "SELECT * FROM coding_tag",
};