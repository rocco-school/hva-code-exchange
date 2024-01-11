import {VoteService} from "../services/voteService";

export class Vote {
    // private fields
    private _voteId: number | null;
    private _userId: number;
    private _questionId: number | null;
    private _answerId: number | null;
    private _voteType: string;
    private _createdAt: Date | null;
    private _updatedAt: Date | null;

    // The constructor is called once when the class is instantiated.
    // This constructor fills the fields when creating an object.
    public constructor(voteId: number | null, userId: number, questionId: number | null, answerId: number | null, voteType: string, createdAt: Date | null, updatedAt: Date | null) {
        this._voteId = voteId;
        this._userId = userId;
        this._questionId = questionId;
        this._answerId = answerId;
        this._voteType = voteType;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
    }

    // Getters
    public get voteId(): number | null {
        return this._voteId;
    }

    public get userId(): number {
        return this._userId;
    }

    public get questionId(): number | null {
        return this._questionId;
    }

    public get answerId(): number | null {
        return this._answerId;
    }

    public get voteType(): string {
        return this._voteType;
    }

    public get createdAt(): Date | null {
        return this._createdAt;
    }

    public get updatedAt(): Date | null {
        return this._updatedAt;
    }

    // Setters
    public set voteId(value: number | null) {
        this._voteId = value;
    }

    public set userId(value: number) {
        this._userId = value;
    }

    public set questionId(value: number | null) {
        this._questionId = value;
    }

    public set answerId(value: number | null) {
        this._answerId = value;
    }

    public set voteType(value: string) {
        this._voteType = value;
    }

    public set createdAt(value: Date | null) {
        this._createdAt = value;
    }

    public set updatedAt(value: Date | null) {
        this._updatedAt = value;
    }

    public toString(): string {
        return `vote: ${this._voteId} ${this._userId} ${this._questionId} ${this._answerId} ${this._voteType} ${this._createdAt} ${this._updatedAt}`;
    }

    /**
     * Saves the vote to the database using the service.
     *
     * @returns {Promise<Vote | string>} A Promise resolving to either the saved vote or an error message.
     * @throws {Error} Throws an error if the save operation fails.
     *
     * @description
     * This method leverages the VoteService to save the current instance of the vote to the database.
     * It handles the save operation asynchronously and returns a Promise that resolves to the saved vote
     * or an error message if the save fails.
     *
     * @example
     * const newVote: Vote = new Vote(
     *   null, // voteId is null for a new vote(auto_increment in the database)
     *   'userId',
     *   'questionId', // Can be null if vote is on answer
     *   'answerId', // Can be null if vote is on question
     *   'voteType', ENUM('upvote', 'downvote')
     *   'null', // CreatedAt auto
     *   'null', // UpdatedAt auto
     * );
     *
     * try {
     *   const savedVote = await newVote.saveVote();
     *   console.log('Vote saved successfully:', savedVote);
     * } catch (error) {
     *   console.error('Failed to save vote:', error.message);
     * }
     */
    public async saveVote(): Promise<Vote | string> {
        try {
            // Calling the saveVote method from the service
            return await VoteService.saveVote(this);
        } catch (error) {
            // Handling any errors that occur during the process
            return `Error saving vote: ${error}`;
        }
    }

    /**
     * Updates the vote in the database using the service.
     *
     * @returns {Promise<Vote | string>} A Promise resolving to either the updated vote or an error message.
     * @throws {Error} Throws an error if the update operation fails.
     *
     * @description
     * This method leverages the VoteService to update the current instance of the vote in the database.
     * It handles the update operation asynchronously and returns a Promise that resolves to the updated vote
     * or an error message if the update fails.
     *
     * @example
     * const VoteToUpdate: Vote = new Vote(
     *   voteId, // Vote to be updated
     *   userId,
     *   questionId,
     *   answerId,
     *   voteType, // Type of vote to update to.
     *   NULL,
     *   NULL,
     * );
     *
     * try {
     *   const updatedVote = await VoteToUpdate.updateVote();
     *   console.log('Vote updated successfully:', updatedVote);
     * } catch (error) {
     *   console.error('Failed to update vote:', error.message);
     * }
     */
    public async updateVote(): Promise<Vote | string> {
        try {
            // Calling the updateVote method from the service.
            return await VoteService.updateVote(this);
        } catch (error) {
            // Handling any errors that occur during the process.
            return `Error updating vote: ${error}`;
        }
    }

    /**
     * Retrieves a vote from the database using the service.
     *
     * @param {number} voteId - The ID of the vote to retrieve.
     * @returns {Promise<Vote | string>} A Promise resolving to either the retrieved vote or an error message.
     * @throws {Error} Throws an error if the retrieval operation fails.
     *
     * @description
     * This static method leverages the VoteService to retrieve a specific vote from the database.
     * It handles the retrieval operation asynchronously and returns a Promise that resolves to either
     * the retrieved vote or an error message if the retrieval fails.
     *
     * @example
     * // Example: Retrieve a vote by its ID
     * try {
     *   const result = await Vote.retrieveVote(voteId);
     *   console.log('Vote retrieved successfully:', result);
     * } catch (error) {
     *   console.error('Failed to retrieve vote:', error.message);
     * }
     */
    public static async retrieveVote(voteId: number): Promise<Vote | string> {
        try {
            // Calling the retrieveVote method from the service.
            return await VoteService.retrieveVote(voteId);
        } catch (error) {
            // Handling any errors that occur during the process.
            return `Error retrieving vote: ${error}`;
        }
    }

    /**
     * Deletes a vote from the database using the service.
     *
     * @param {number} voteId - The ID of the vote to delete.
     * @returns {Promise<boolean | string>} A Promise resolving to either the deletion status or an error message.
     * @throws {Error} Throws an error if the deletion operation fails.
     *
     * @description
     * This static method leverages the VoteService to delete a specific vote from the database.
     * It handles the deletion operation asynchronously and returns a Promise that resolves to either
     * the deletion status (true if successful, false if the vote was not found) or an error message if the deletion fails.
     *
     * @example
     * // Example: Delete a vote by its ID
     * try {
     *   const deleteStatus = await Vote.deleteVote(voteId);
     *   if (deleteStatus) {
     *     console.log('Vote deleted successfully.');
     *   } else {
     *     console.log('Vote with the specified ID not found.');
     *   }
     * } catch (error) {
     *   console.error('Failed to delete vote:', error.message);
     * }
     */
    public static async deleteVote(voteId: number): Promise<boolean | string> {
        try {
            // Calling the deleteVote method from the service.
            return await VoteService.deleteVote(voteId);
        } catch (error) {
            // Handling any errors that occur during the process.
            return `Error deleting vote: ${error}`;
        }
    }

    /**
     * Retrieves a vote from the database based on user and question IDs using the service.
     *
     * @param {number} userId - The ID of the user associated with the vote.
     * @param {number} questionId - The ID of the question associated with the vote.
     * @returns {Promise<Vote | string>} A Promise resolving to either the retrieved vote or an error message.
     * @throws {Error} Throws an error if the retrieval operation fails.
     *
     * @description
     * This static method leverages the VoteService to retrieve a specific vote from the database based on
     * the provided user and question IDs. It handles the retrieval operation asynchronously and returns
     * a Promise that resolves to either the retrieved vote or
     * an error message if the retrieval fails.
     *
     * @example
     * // Example: Retrieve a vote by user and question IDs
     * try {
     *   const getVote = await Vote.getVoteByUserAndQuestionId(userId, questionId);
     *   console.log('Vote retrieved successfully:', getVote);
     * } catch (error) {
     *   console.error('Failed to retrieve vote:', error.message);
     * }
     */
    public static async getVoteByUserAndQuestionId(userId: number, questionId: number): Promise<Vote | string> {
        try {
            // Calling the getVoteByUserAndQuestionId method from the service.
            return await VoteService.getVoteByUserAndQuestionId(userId, questionId);
        } catch (error) {
            // Handling any errors that occur during the process.
            return `Error retrieving vote: ${error}`;
        }
    }


    /**
     * Retrieves a vote from the database based on user and answer IDs using the service.
     *
     * @param {number} userId - The ID of the user associated with the vote.
     * @param {number} answerId - The ID of the answer associated with the vote.
     * @returns {Promise<Vote | string>} A Promise resolving to either the retrieved vote or an error message.
     * @throws {Error} Throws an error if the retrieval operation fails.
     *
     * @description
     * This static method leverages the VoteService to retrieve a specific vote from the database based on
     * the provided user and answer ID. It handles the retrieval operation asynchronously and returns
     * a Promise that resolves to either the retrieved vote or
     * an error message if the retrieval fails.
     *
     * @example
     * // Example: Retrieve a vote by user and answer ID
     * try {
     *   const getVote = await Vote.getVoteByUserAndQuestionId(userId, answerId);
     *   console.log('Vote retrieved successfully:', getVote);
     * } catch (error) {
     *   console.error('Failed to retrieve vote:', error.message);
     * }
     */
    public static async getVoteByUserAndAnswerId(userId: number, answerId: number): Promise<Vote | string> {
        try {
            // Calling the getVoteByUserAndAnswerId method from the service.
            return await VoteService.getVoteByUserAndAnswerId(userId, answerId);
        } catch (error) {
            // Handling any errors that occur during the process.
            return `Error retrieving vote: ${error}`;
        }
    }

}
