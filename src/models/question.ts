import {QuestionService} from "../services/questionService";

export class Question {
    // private fields
    private _questionId: number | null;
    private _userId: number;
    private _questionTitle: string;
    private _questionBody: string;
    private _isClosed: boolean;
    private _createdAt: Date | null;
    private _updatedAt: Date | null;

    // The constructor is called once when the class is instantiated.
    // This constructor fills the fields when creating an object.
    public constructor(questionId: number | null, userId: number, questionTitle: string, questionBody: string, isClosed: boolean, createdAt: Date | null, updatedAt: Date | null) {
        this._questionId = questionId;
        this._userId = userId;
        this._questionTitle = questionTitle;
        this._questionBody = questionBody;
        this._isClosed = isClosed;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
    }

    // Getters en setters
    public get questionId(): number | null {
        return this._questionId;
    }

    public get userId(): number {
        return this._userId;
    }

    public get questionTitle(): string {
        return this._questionTitle;
    }

    public get questionBody(): string {
        return this._questionBody;
    }

    public get isClosed(): boolean {
        return this._isClosed;
    }

    public get createdAt(): Date | null {
        return this._createdAt;
    }

    public get updatedAt(): Date | null {
        return this._updatedAt;
    }

    public set questionId(value: number | null) {
        this._questionId = value;
    }

    public set userId(value: number) {
        this._userId = value;
    }

    public set questionTitle(value: string) {
        this._questionTitle = value;
    }

    public set questionBody(value: string) {
        this._questionBody = value;
    }

    public set isClosed(value: boolean) {
        this._isClosed = value;
    }

    public set createdAt(value: Date | null) {
        this._createdAt = value;
    }

    public set updatedAt(value: Date | null) {
        this._updatedAt = value;
    }

    public toString(): string {
        return `User: ${this._questionId} ${this._userId} ${this._questionTitle} ${this._questionBody} ${this._isClosed} ${this._createdAt} ${this._updatedAt}`;
    }

    /**
     * Saves the question to the database using the service.
     *
     * @returns {Promise<Question[] | string>} A Promise resolving to either the saved questions or an error message.
     * @throws {Error} Throws an error if the save operation fails.
     */
    public async saveQuestion(): Promise<Question[] | string> {
        try {
            // Calling the saveQuestion method from the service
            return await QuestionService.saveQuestion(this);
        } catch (error) {
            // Handling any errors that occur during the process
            return `Error saving question: ${error}`;
        }
    }

    /**
     * Updates the question in the database using the service.
     *
     * @returns {Promise<Question[] | string>} A Promise resolving to either the updated questions or an error message.
     * @throws {Error} Throws an error if the update operation fails.
     */
    public async updateQuestion(): Promise<Question[] | string> {
        try {
            // Calling the updateQuestion method from the service.
            return await QuestionService.updateQuestion(this);
        } catch (error) {
            // Handling any errors that occur during the process.
            return `Error updating question: ${error}`;
        }
    }

    /**
     * Retrieves questions from the database using the service.
     *
     * @returns {Promise<Question[] | string>} A Promise resolving to either the retrieved questions or an error message.
     * @throws {Error} Throws an error if the retrieval operation fails.
     */
    public static async getQuestions(): Promise<Question[] | string> {
        try {
            // Calling the getQuestions method from the service.
            return await QuestionService.getQuestions();
        } catch (error) {
            // Handling any errors that occur during the process.
            return `Error retrieving questions: ${error}`;
        }
    }

    /**
     * Retrieves a question from the database using the service.
     *
     * @param {number} questionId - The ID of the question to retrieve.
     * @returns {Promise<Question[] | string>} A Promise resolving to either the retrieved question or an error message.
     * @throws {Error} Throws an error if the retrieval operation fails.
     */
    public static async retrieveQuestion(questionId: number): Promise<Question[] | string> {
        try {
            // Calling the retrieveQuestion method from the service.
            return await QuestionService.retrieveQuestion(questionId);
        } catch (error) {
            // Handling any errors that occur during the process.
            return `Error retrieving question: ${error}`;
        }
    }


    /**
     * Inserts tags for a given question into the database.
     *
     * @param {number} questionId - The ID of the question.
     * @param {number[]} tagIds - An array of tag IDs to associate with the question.
     * @returns {Promise<number | string>} A Promise resolving to either the question ID or an error message.
     * @throws {Error} Throws an error if the insertion operation fails.
     */
    public static async insertQuestionTag(questionId: number, tagIds: number[]): Promise<number | string> {
        try {
            // Call the insertQuestionTag method from the service.
            return await QuestionService.insertQuestionTag(questionId, tagIds);
        } catch (error) {
            // Handle any errors that occur during the process.
            return `Error inserting question tags: ${error}`;
        }
    }

    /**
     * Deletes a question from the database using the service.
     *
     * @param {number} questionId - The ID of the question to delete.
     * @returns {Promise<Question[] | string>} A Promise resolving to either delete the questions or an error message.
     * @throws {Error} Throws an error if the deletion operation fails.
     */
    public static async deleteQuestion(questionId: number): Promise<Question[] | string> {
        try {
            // Calling the deleteQuestion method from the service.
            return await QuestionService.deleteQuestion(questionId);
        } catch (error) {
            // Handling any errors that occur during the process.
            return `Error deleting question: ${error}`;
        }
    }
}


