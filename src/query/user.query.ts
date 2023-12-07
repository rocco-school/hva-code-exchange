export const USER_QUERY: {
    SELECT_USER: string;
    SELECT_USERS: string;
    CREATE_USER: string;
    DELETE_USER: string;
    UPDATE_USER: string;
    FIND_USER_BY_EMAIL: string
    GET_USER_PASSWORD_BY_EMAIL: string
    GET_EMAIL_BY_EMAIL: string
} = {
    SELECT_USERS: "SELECT * FROM user LIMIT 50",
    SELECT_USER: "SELECT * FROM user WHERE user_id = ?",
    CREATE_USER: "INSERT INTO user (firstname, lastname, username, password, email) VALUES(?, ?, ?, ?, ?)",
    UPDATE_USER: "UPDATE user SET email = ?, password = ?, username = ? WHERE user_id = ?",
    DELETE_USER: "DELETE FROM user WHERE user_id = ?",
    FIND_USER_BY_EMAIL: "SELECT * FROM user WHERE email = ?",
    GET_USER_PASSWORD_BY_EMAIL: "SELECT * FROM user WHERE email = ?",
    GET_EMAIL_BY_EMAIL: "SELECT email FROM user WHERE email = ?",
};