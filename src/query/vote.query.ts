export const VOTE_QUERY: {
    SELECT_VOTES: string;
    SELECT_VOTE: string;
    CREATE_VOTE: string;
    UPDATE_VOTE: string;
    DELETE_VOTE: string;
    GET_VOTE_BY_USER_AND_QUESTION: string;
    GET_VOTE_BY_USER_AND_ANSWER: string;
} = {
    SELECT_VOTES: "SELECT * FROM vote LIMIT 50",
    SELECT_VOTE: "SELECT * FROM vote WHERE voteId = ?",
    CREATE_VOTE: "INSERT INTO vote (userId, questionId, answerId, voteType) VALUES(?, ?, ?, ?)",
    UPDATE_VOTE: "UPDATE vote SET userId = ?, questionId = ?, answerId = ?, voteType = ? WHERE voteId = ?",
    DELETE_VOTE: "DELETE FROM vote WHERE voteId = ?",
    GET_VOTE_BY_USER_AND_QUESTION: "SELECT * FROM vote WHERE userId = ? AND questionId = ?",
    GET_VOTE_BY_USER_AND_ANSWER: "SELECT * FROM vote WHERE userId = ? AND answerId = ?"
};