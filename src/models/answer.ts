import {AnswerService} from "../services/answerService";
import {Post} from "./post";

export class Answer extends Post {
    // private fields
    private _answerId: number | null;
    private _questionId: number;
    private _userId: number;
    private _answerBody: string;

    // The constructor is called once when the class is instantiated.
    // This constructor fills the fields when creating an object.
    public constructor(answerId: number | null, questionId: number, userId: number, answerBody: string, createdAt: Date | null, updatedAt: Date | null) {
        super(createdAt, updatedAt);
        this._answerId = answerId;
        this._questionId = questionId;
        this._userId = userId;
        this._answerBody = answerBody;
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

    public toString(): string {
        return `Answer: ${this._answerId} ${this._questionId} ${this._userId} ${this.answerBody} ${this._createdAt} ${this._updatedAt}`;
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
}
