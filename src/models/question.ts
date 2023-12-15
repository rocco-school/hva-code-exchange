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
     * @returns {Promise<Question | string>} A Promise resolving to either the saved question or an error message.
     * @throws {Error} Throws an error if the save operation fails.
     *
     * @description
     * This method leverages the QuestionService to save the current instance of the Question to the database.
     * It handles the save operation asynchronously and returns a Promise that resolves to the saved question
     * or an error message if the save fails.
     *
     * @example
     * const newQuestion: Question = new Question(
     *   null, // questionId is null for a new question (auto_increment in the database)
     *   'userId',
     *   'questionTitle',
     *   'questionBody',
     *   False, // isClosed = True / False
     *   null, // createdAt (auto-updated in the database)
     *   null // updatedAt (auto-updated in the database)
     * );
     *
     * try {
     *   const savedQuestion = await newQuestion.saveQuestion();
     *   console.log('Question saved successfully:', savedQuestion);
     * } catch (error) {
     *   console.error('Failed to save question:', error.message);
     * }
     */
    public async saveQuestion(): Promise<Question | string> {
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
     * @returns {Promise<Question | string>} A Promise resolving to either the updated question or an error message.
     * @throws {Error} Throws an error if the update operation fails.
     *
     * @description
     * This method leverages the QuestionService to update the current instance of the Question in the database.
     * It handles the update operation asynchronously and returns a Promise that resolves to the updated question
     * or an error message if the update fails.
     *
     * @example
     * const questionToUpdate = new Question(
     *   questionId,
     *   userId,
     *   questionTitle,
     *   questionBody,
     *   isClosed,
     *   null, // createdAt
     *   null, // updatedAt auto-updates in the database
     * );
     *
     * try {
     *   const updatedQuestion = await questionToUpdate.updateQuestion();
     *   console.log('Question updated successfully:', updatedQuestion);
     * } catch (error) {
     *   console.error('Failed to update question:', error.message);
     * }
     */
    public async updateQuestion(): Promise<Question | string> {
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
     *
     * @description
     * This static method leverages the QuestionService to retrieve questions from the database.
     * It handles the retrieval operation asynchronously and returns a Promise that resolves to either
     * an array of retrieved questions or an error message if the retrieval fails.
     *
     * @example
     * try {
     *   // Example: Retrieve questions from the database
     *   const questions = await Question.getQuestions();
     *   console.log('Questions retrieved successfully:', questions);
     * } catch (error) {
     *   console.error('Failed to retrieve questions:', error.message);
     * }
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
     * @returns {Promise<Question | string>} A Promise resolving to either the retrieved question or an error message.
     * @throws {Error} Throws an error if the retrieval operation fails.
     *
     * @description
     * This static method leverages the QuestionService to retrieve a specific question from the database.
     * It handles the retrieval operation asynchronously and returns a Promise that resolves to either
     * the retrieved question or an error message if the retrieval fails.
     *
     * @example
     * // Example: Retrieve a question by its ID
     * try {
     *   const result = await Question.retrieveQuestion(questionId);
     *   console.log('Question retrieved successfully:', result);
     * } catch (error) {
     *   console.error('Failed to retrieve question:', error.message);
     * }
     */
    public static async retrieveQuestion(questionId: number): Promise<Question | string> {
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
     * @returns {Promise<boolean | string>} A Promise resolving to either the insertion status or an error message.
     * @throws {Error} Throws an error if the insertion operation fails.
     *
     * @description
     * This static method leverages the QuestionService to insert tags for a specific question into the database.
     * It handles the insertion operation asynchronously and returns a Promise that resolves to either
     * the insertion status (true if successful) or an error message if the insertion fails.
     *
     * @example
     * // Example: Insert tags for a question
     * try {
     *   const questionTags: number[] = [1, 2, 3]; // coding_tag ids.
     *   const insertStatus = await Question.insertQuestionTag(questionId, questionTags);
     *   if (insertStatus) {
     *     console.log('Question tags inserted successfully.');
     *   } else {
     *     console.log('Failed to insert question tags.');
     *   }
     * } catch (error) {
     *   console.error('Error inserting question tags:', error.message);
     * }
     */
    public static async insertQuestionTag(questionId: number, tagIds: number[]): Promise<boolean | string> {
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
     * @returns {Promise<boolean | string>} A Promise resolving to either the deletion status or an error message.
     * @throws {Error} Throws an error if the deletion operation fails.
     *
     * @description
     * This static method leverages the QuestionService to delete a specific question from the database.
     * It handles the deletion operation asynchronously and returns a Promise that resolves to either
     * the deletion status (true if successful, false if the question was not found) or an error message if the deletion fails.
     *
     * @example
     * // Example: Delete a question by its ID
     * try {
     *   const deleteStatus = await Question.deleteQuestion(questionId);
     *   if (deleteStatus) {
     *     console.log('Question deleted successfully.');
     *   } else {
     *     console.log('Question with the specified ID not found.');
     *   }
     * } catch (error) {
     *   console.error('Failed to delete question:', error.message);
     * }
     */
    public static async deleteQuestion(questionId: number): Promise<boolean | string> {
        try {
            // Calling the deleteQuestion method from the service.
            return await QuestionService.deleteQuestion(questionId);
        } catch (error) {
            // Handling any errors that occur during the process.
            return `Error deleting question: ${error}`;
        }
    }
}
