import {AnswerService} from "../services/answerService";
import {Answer} from "./answer";

export class Post {
    // private fields
    private _createdAt: Date | null;
    private _updatedAt: Date | null;

    // The constructor is called once when the class is instantiated.
    // This constructor fills the fields when creating an object.
    public constructor(createdAt: Date | null, updatedAt: Date | null) {
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
    }

    // Getters en setters
    public get createdAt(): Date | null {
        return this._createdAt;
    }

    public get updatedAt(): Date | null {
        return this._updatedAt;
    }

    public set createdAt(value: Date | null) {
        this._createdAt = value;
    }

    public set updatedAt(value: Date | null) {
        this._updatedAt = value;
    }

    public toString(): string {
        return `Post: ${this._createdAt} ${this._updatedAt}`;
    }


    /**
     * Retrieves answers from the database based on the provided question ID.
     *
     * @param {number} questionId - The ID of the question to retrieve answers for.
     * @returns {Promise<Answer[] | string>} A Promise that resolves to an array of retrieved answers or an error message.
     * @throws {Error} Throws an error if the retrieval operation fails.
     *
     * @description
     * This static method uses the AnswerService to asynchronously retrieve answers from the database
     * based on the specified question ID. It returns a Promise that resolves to either the retrieved answers
     * or an error message if the retrieval fails.
     *
     * @example
     * // Example: Retrieve answers by question ID
     * try {
     *   const result = await Answer.getAnswersByQuestionId(questionId);
     *   console.log('Answers retrieved successfully:', result);
     * } catch (error) {
     *   console.error('Failed to retrieve answers:', error.message);
     * }
     */
    public static async getAnswersByQuestionId(questionId: number): Promise<Answer[] | string> {
        try {
            // Calling the getAnswersByQuestionId method from the service.
            return await AnswerService.getAnswersByQuestionId(questionId);
        } catch (error) {
            // Handling any errors that occur during the process.
            return `Error retrieving answers: ${error}`;
        }
    }
}
