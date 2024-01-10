export const VOTE_QUERY: {
    SELECT_VOTES: string;
    SELECT_VOTE: string;
    CREATE_VOTE: string;
    DELETE_VOTE: string;
    UPDATE_VOTE: string;
} = {
    SELECT_VOTES: "SELECT * FROM vote LIMIT 50",
    SELECT_VOTE: "SELECT * FROM vote WHERE voteId = ?",
    CREATE_VOTE: "INSERT INTO vote (userId, questionId, answerId, voteType) VALUES(?, ?, ?, ?)",
    DELETE_VOTE: "UPDATE vote SET userId = ?, questionId = ?, answerId = ?, voteType = ? WHERE voteId = ?",
    UPDATE_VOTE: "DELETE FROM vote WHERE voteId = ?"
};