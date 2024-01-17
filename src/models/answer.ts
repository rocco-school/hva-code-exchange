import {AnswerService} from "../services/answerService";
import {Post} from "./post";

export class Answer extends Post {
    // private fields
    private _answerId: number | null;
    private _questionId: number;
    private _userId: number;
    private _answerBody: string;
    private _totalUpvotes: number | null;
    private _totalDownvotes: number | null;
    private _isAccepted: boolean;

    // The constructor is called once when the class is instantiated.
    // This constructor fills the fields when creating an object.
    public constructor(answerId: number | null, questionId: number, userId: number, answerBody: string, totalUpvotes: number | null, totalDownvotes: number | null, isAccepted: boolean, createdAt: Date | null, updatedAt: Date | null) {
        super(createdAt, updatedAt);
        this._answerId = answerId;
        this._questionId = questionId;
        this._userId = userId;
        this._answerBody = answerBody;
        this._totalUpvotes = totalUpvotes;
        this._totalDownvotes = totalDownvotes;
        this._isAccepted = isAccepted;
    }

    // Getters en setters
    public get answerId(): number | null {
        return this._answerId;
    }

    public get questionId(): number {
        return this._questionId;
    }

    public get userId(): number {
        return this._userId;
    }

    public get answerBody(): string {
        return this._answerBody;
    }

    public get totalUpvotes(): number | null {
        return this._totalUpvotes;
    }

    public get totalDownvotes(): number | null {
        return this._totalDownvotes;
    }

    public get isAccepted(): boolean {
        return this._isAccepted;
    }

    public set answerId(value: number | null) {
        this._answerId = value;
    }

    public set questionId(value: number) {
        this._questionId = value;
    }

    public set userId(value: number) {
        this._userId = value;
    }

    public set answerBody(value: string) {
        this._answerBody = value;
    }

    public set totalUpvotes(value: number | null) {
        this._totalUpvotes = value;
    }

    public set totalDownvotes(value: number | null) {
        this._totalDownvotes = value;
    }

    public set isAccepted(value: boolean) {
        this._isAccepted = value;
    }

    public toString(): string {
        return `Answer: ${this._answerId} ${this._questionId} ${this._userId} ${this._answerBody} ${this._totalUpvotes} ${this._totalDownvotes} ${this._isAccepted} ${this.createdAt} ${this.updatedAt}`;
    }

    /**
     * Toggles the isAccepted field and updates the answer in the database using the service.
     *
     * @returns {Promise<Answer | string>} A Promise resolving to either the updated answer or an error message.
     * @throws {Error} Throws an error if the update operation fails.
     *
     * @example
     * const answerToUpdate: Answer = new Answer(
     *   // ... (your answer initialization parameters)
     * );
     *
     * try {
     *   const updatedAnswer = await answerToUpdate.toggleIsAcceptedAndUpdate();
     *   console.log('Answer updated successfully:', updatedAnswer);
     * } catch (error) {
     *   console.error('Failed to update answer:', error.message);
     * }
     */
    public async toggleIsAcceptedAndUpdate(): Promise<Answer | string> {
        // Toggle the isAccepted field
        this.isAccepted = !this.isAccepted;

        try {
            // Calling the updateAnswer method from the service.
            return await AnswerService.updateAnswer(this);
        } catch (error) {
            // Handling any errors that occur during the process.
            return `Error updating answer: ${error}`;
        }
    }

    /**
     * Saves the answer to the database using the service.
     *
     * @returns {Promise<Answer | string>} A Promise resolving to either the saved answer or an error message.
     * @throws {Error} Throws an error if the save operation fails.
     *
     * @description
     * This method leverages the AnswerService to save the current instance of the Answer to the database.
     * It handles the save operation asynchronously and returns a Promise that resolves to the saved answer
     * or an error message if the save fails.
     *
     * @example
     * const newAnswer: Answer = new Answer(
     *   null, // answerId is null for a new answer (auto_increment in the database)
     *   'questionId',
     *   'userId',
     *   'answerBody',
     *   null, // createdAt (auto-updated in the database)
     *   null // updatedAt (auto-updated in the database)
     * );
     *
     * try {
     *   const savedAnswer = await newAnswer.saveAnswer();
     *   console.log('Answer saved successfully:', savedAnswer);
     * } catch (error) {
     *   console.error('Failed to save answer:', error.message);
     * }
     */
    public async saveAnswer(): Promise<Answer | string> {
        try {
            // Calling the saveAnswer method from the service
            return await AnswerService.saveAnswer(this);
        } catch (error) {
            // Handling any errors that occur during the process
            return `Error saving answer: ${error}`;
        }
    }

    /**
     * Updates the answer in the database using the service.
     *
     * @returns {Promise<Answer | string>} A Promise resolving to either the updated answer or an error message.
     * @throws {Error} Throws an error if the update operation fails.
     *
     * @description
     * This method leverages the AnswerService to update the current instance of the answer in the database.
     * It handles the update operation asynchronously and returns a Promise that resolves to the updated answer
     * or an error message if the update fails.
     *
     * @example
     * const AnswerToUpdate: Answer = new Answer(
     *   answerId
     *   questionId,
     *   userId,
     *   answerBody,
     *   null, // Default totalUpvotes is 0
     *   null, // Default totalDownvotes is 0
     *   false, // isAccepted is false. can also be null because database default is false.
     *   null, // createdAt
     *   null, // updatedAt auto-updates in the database
     * );
     *
     * try {
     *   const updatedAnswer = await AnswerToUpdate.updateAnswer();
     *   console.log('Answer updated successfully:', updatedAnswer);
     * } catch (error) {
     *   console.error('Failed to update answer:', error.message);
     * }
     */
    public async updateAnswer(): Promise<Answer | string> {
        try {
            // Calling the updateAnswer method from the service.
            return await AnswerService.updateAnswer(this);
        } catch (error) {
            // Handling any errors that occur during the process.
            return `Error updating answer: ${error}`;
        }
    }

    /**
     * Retrieves an answer from the database using the service.
     *
     * @param {number} answerId - The ID of the Answer to retrieve.
     * @returns {Promise<Answer | string>} A Promise resolving to either the retrieved answer or an error message.
     * @throws {Error} Throws an error if the retrieval operation fails.
     *
     * @description
     * This static method leverages the AnswerService to retrieve a specific answer from the database.
     * It handles the retrieval operation asynchronously and returns a Promise that resolves to either
     * the retrieved answer or an error message if the retrieval fails.
     *
     * @example
     * // Example: Retrieve an answer by its ID
     * try {
     *   const result = await Answer.retrieveAnswer(answerId);
     *   console.log('Answer retrieved successfully:', result);
     * } catch (error) {
     *   console.error('Failed to retrieve answer:', error.message);
     * }
     */
    public static async retrieveAnswer(answerId: number): Promise<Answer | string> {
        try {
            // Calling the retrieveAnswer method from the service.
            return await AnswerService.retrieveAnswer(answerId);
        } catch (error) {
            // Handling any errors that occur during the process.
            return `Error retrieving answer: ${error}`;
        }
    }

    /**
     * Deletes an answer from the database using the service.
     *
     * @param {number} answerId - The ID of the answer to delete.
     * @returns {Promise<boolean | string>} A Promise resolving to either the deletion status or an error message.
     * @throws {Error} Throws an error if the deletion operation fails.
     *
     * @description
     * This static method leverages the AnswerService to delete a specific answer from the database.
     * It handles the deletion operation asynchronously and returns a Promise that resolves to either
     * the deletion status (true if successful, false if the answer was not found) or an error message if the deletion fails.
     *
     * @example
     * // Example: Delete an answer by its ID
     * try {
     *   const deleteStatus = await Answer.deleteAnswer(answerId);
     *   if (deleteStatus) {
     *     console.log('Answer deleted successfully.');
     *   } else {
     *     console.log('Answer with the specified ID not found.');
     *   }
     * } catch (error) {
     *   console.error('Failed to delete answer:', error.message);
     * }
     */
    public static async deleteAnswer(answerId: number): Promise<boolean | string> {
        try {
            // Calling the deleteAnswer method from the service.
            return await AnswerService.deleteAnswer(answerId);
        } catch (error) {
            // Handling any errors that occur during the process.
            return `Error deleting answer: ${error}`;
        }
    }


    /**
     * Update the total upvotes for an answer using the AnswerService.
     *
     * @param {number} answerId - The ID of the answer to update.
     * @param {boolean} increment - If true, increment total upvotes by 1; if false, decrement by 1.
     * @returns {Promise<Answer | string>} A Promise resolving to the updated answer object or an error message.
     * @throws {Error} Throws an error if the update operation fails.
     *
     * @description
     * This static method calls the updateTotalUpvotes method from the AnswerService to update
     * the total upvotes for a answer. It forwards the request to the service layer, handling any
     * errors that may occur during the process. The function returns a Promise that resolves to either
     * the updated answer object or an error message.
     *
     * @example
     * // Example: Update total upvotes for a answer by incrementing.
     * const answerIdToUpdate = 123;
     * try {
     *   const updatedAnswer = await Answer.updateTotalUpvotes(answerIdToUpdate, true);
     *   console.log('Total upvotes updated successfully:', updatedAnswer);
     * } catch (error) {
     *   console.error('Failed to update total upvotes:', error);
     * }
     */
    public static async updateTotalUpvotes(answerId: number, increment: boolean): Promise<Answer | string> {
        try {
            // Calling the updateTotalUpvotes method from the service.
            return await AnswerService.updateTotalUpvotes(answerId, increment);
        } catch (error) {
            // Handling any errors that occur during the process.
            return `Error updating answer total upvotes: ${error}`;
        }
    }

    /**
     * Update the total downvotes for an answer using the AnswerService.
     *
     * @param {number} answerId - The ID of the answer to update.
     * @param {boolean} increment - If true, increment total downvotes by 1; if false, decrement by 1.
     * @returns {Promise<Answer | string>} A Promise resolving to the updated answer object or an error message.
     * @throws {Error} Throws an error if the update operation fails.
     *
     * @description
     * This static method calls the updateTotalDownvotes method from the AnswerService to update
     * the total downvotes for an answer. It forwards the request to the service layer, handling any
     * errors that may occur during the process. The function returns a Promise that resolves to either
     * the updated answer object or an error message.
     *
     * @example
     * // Example: Update total downvotes for a answer by incrementing.
     * const answerIdToUpdate = 123;
     * try {
     *   const updatedAnswer = await Answer.updateTotalDownvotes(answerIdToUpdate, true);
     *   console.log('Total downvotes updated successfully:', updatedAnswer);
     * } catch (error) {
     *   console.error('Failed to update total downvotes:', error);
     * }
     */
    public static async updateTotalDownvotes(answerId: number, increment: boolean): Promise<Answer | string> {
        try {
            // Calling the updateTotalDownvotes method from the service.
            return await AnswerService.updateTotalDownvotes(answerId, increment);
        } catch (error) {
            // Handling any errors that occur during the process.
            return `Error updating answer total downvotes: ${error}`;
        }
    }
}
