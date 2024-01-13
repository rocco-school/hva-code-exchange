import {api} from "@hboictcloud/api";
import {Vote} from "../models/vote";
import {VOTE_QUERY} from "../query/vote.query";

/**
 * A service class for handling operations related to votes in the database.
 *
 * @class
 */
export class VoteService {
    /**
     * Save a vote to the database.
     *
     * @param {Vote} vote - The vote object to be saved.
     * @returns {Promise<Vote>} A Promise resolving to the saved vote.
     * @throws {Error} Throws an error if the database query was not successful.
     *
     * @description
     * This static method saves a new vote to the database using the provided vote object.
     * If the voteId is null, it indicates a new vote, and the database will auto-increment the ID.
     * It queries the database to create a new vote and returns a Promise that resolves to the saved vote.
     *
     */
    public static async saveVote(vote: Vote): Promise<Vote> {
        // Querying the database with the new vote data.
        const param: (string | number | boolean | null)[] = [vote.userId, vote.questionId, vote.answerId, vote.voteType, vote.voteId];
        const newVote: any = await api.queryDatabase(VOTE_QUERY.CREATE_VOTE, ...param);

        // Retrieving the newly created vote from the database.
        const getVote: [Vote] = await api.queryDatabase(VOTE_QUERY.SELECT_VOTE, newVote.insertId) as [Vote];

        // Checking if the database query was successful.
        if (!getVote) {
            // If the query was not successful, throw an error.
            throw new Error("Failed to create vote in the database");
        }

        return getVote[0];
    }

    /**
     * Update a vote in the database.
     *
     * @param {Vote} vote - The vote object containing the updated data.
     * @returns {Promise<Vote>} A Promise resolving to the updated vote.
     * @throws {Error} Throws an error if the database update was not successful.
     *
     * @description
     * This static method updates a vote in the database using the provided vote object.
     * It destructures the vote object to extract individual properties and then queries the database
     * to perform the update. The method returns a Promise that resolves to the updated vote.
     */
    public static async updateVote(vote: Vote): Promise<Vote> {
        try {
            // Update the vote in the Vote table.
            const voteData: (string | number | boolean | null)[] = [vote.userId, vote.questionId, vote.answerId, vote.voteType, vote.voteId];
            await api.queryDatabase(VOTE_QUERY.UPDATE_VOTE, ...voteData);

            // Retrieve the updated vote from the database.
            const getVote: [Vote] = await api.queryDatabase(VOTE_QUERY.SELECT_VOTE, vote.voteId) as [Vote];

            // Checking if the database retrieval was successful.
            if (!getVote) {
                new Error(`Failed to get Vote: ${vote.voteId}!`);
            }

            // Return the updated vote.
            return getVote[0];
        } catch (error) {
            // Handle any errors that occur during the update or retrieval process.
            throw new Error(`Failed to update Vote: ${vote.voteId}: ${error}`);
        }
    }

    /**
     * Retrieve a vote from the database.
     *
     * @param {number} voteId - The ID of the vote to be retrieved.
     * @returns {Promise<Vote>} A Promise resolving to the retrieved vote.
     * @throws {Error} Throws an error if the database retrieval was not successful.
     *
     * @description
     * This static method retrieves a specific vote from the database based on its ID.
     * It queries the database to retrieve the vote with the given voteId and returns
     * a Promise that resolves to the retrieved vote.
     */
    public static async retrieveVote(voteId: number): Promise<Vote> {
        // Querying the database to retrieve the vote with the given voteId.
        const getVote: [Vote] = await api.queryDatabase(VOTE_QUERY.SELECT_VOTE, voteId) as [Vote];

        // Checking if the database retrieval was successful.
        if (!getVote) {
            throw new Error(`Failed to retrieve vote with ID: ${voteId}`);
        }

        return getVote[0];
    }

    /**
     * Delete a vote in the database.
     *
     * @param {number} voteId - The ID of the vote to be deleted.
     * @returns {Promise<boolean>} A Promise resolving to the deletion status.
     * @throws {Error} Throws an error if the database deletion was not successful.
     *
     * @description
     * This static method deletes a specific vote from the database based on its ID.
     * It queries the database to delete the vote with the given vote and returns
     * a Promise that resolves to a boolean indicating whether the deletion was successful.
     */
    public static async deleteVote(voteId: number): Promise<boolean> {
        // Querying the database to delete the vote with the given voteId.
        const deleteVote: any = await api.queryDatabase(VOTE_QUERY.DELETE_VOTE, voteId) as any;

        // Checking if the database deletion was successful.
        if (deleteVote.affectedRows === 0) {
            return false; // No rows affected, indicating the vote was not found.
        }

        if (deleteVote.affectedRows > 0) {
            return true; // Deletion successful.
        }

        // If affectedRows is not 0 or greater than 0, something unexpected happened.
        throw new Error(`Failed to delete vote with ID: ${voteId}`);
    }

    /**
     * Retrieves a vote from the database based on user and question IDs.
     *
     * @param {number} userId - The ID of the user associated with the vote.
     * @param {number} questionId - The ID of the question associated with the vote.
     * @returns {Promise<Vote>} A Promise resolving to the retrieved vote.
     * @throws {Error} Throws an error if the database retrieval was not successful.
     *
     * @description
     * This static method retrieves a specific vote from the database based on its associated
     * user and questionId. It queries the database to retrieve the vote with the given
     * user and questionId and returns a Promise that resolves to the retrieved vote.
     */
    public static async getVoteByUserAndQuestionId(userId: number, questionId: number): Promise<Vote> {
        // Querying the database to retrieve the vote with the given user and questionId.
        const param: number[] = [userId, questionId];
        const getVote: [Vote] = await api.queryDatabase(VOTE_QUERY.GET_VOTE_BY_USER_AND_QUESTION, ...param) as [Vote];

        // Checking if the database retrieval was successful.
        if (!getVote) {
            throw new Error(`Failed to retrieve vote for user: ${userId} on question: ${questionId}`);
        }

        return getVote[0];
    }

    /**
     * Retrieves a vote from the database based on user and answerId.
     *
     * @param {number} userId - The ID of the user associated with the vote.
     * @param {number} answerId - The ID of the answer associated with the vote.
     * @returns {Promise<Vote>} A Promise resolving to the retrieved vote.
     * @throws {Error} Throws an error if the database retrieval was not successful.
     *
     * @description
     * This static method retrieves a specific vote from the database based on its associated
     * user and answerId. It queries the database to retrieve the vote with the given
     * user and answerId and returns a Promise that resolves to the retrieved vote.
     */
    public static async getVoteByUserAndAnswerId(userId: number, answerId: number): Promise<Vote> {
        // Querying the database to retrieve the vote with the given user and answerId.
        const param: number[] = [userId, answerId];
        const getVote: [Vote] = await api.queryDatabase(VOTE_QUERY.GET_VOTE_BY_USER_AND_ANSWER, ...param) as [Vote];

        // Checking if the database retrieval was successful.
        if (!getVote) {
            throw new Error(`Failed to retrieve vote for user: ${userId} on answer: ${answerId}`);
        }

        return getVote[0];
    }
}