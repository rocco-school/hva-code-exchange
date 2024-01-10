import {QuestionService} from "../services/questionService";
import {AnswerService} from "../services/answerService";
import {AnswerWithUser} from "./interface/answerWithUser";
import {Post} from "./post";

export class Question extends Post {
    // private fields
    private _questionId: number | null;
    private _userId: number;
    private _questionTitle: string;
    private _questionBody: string;
    private _isClosed: boolean;
    private _totalUpvotes: number | null;
    private _totalDownvotes: number | null;

    // The constructor is called once when the class is instantiated.
    // This constructor fills the fields when creating an object.
    public constructor(questionId: number | null, userId: number, questionTitle: string, questionBody: string, isClosed: boolean, totalUpvotes: number | null, totalDownvotes: number | null, createdAt: Date | null, updatedAt: Date | null) {
        super(createdAt, updatedAt);
        this._questionId = questionId;
        this._userId = userId;
        this._questionTitle = questionTitle;
        this._questionBody = questionBody;
        this._isClosed = isClosed;
        this._totalUpvotes = totalUpvotes;
        this._totalDownvotes = totalDownvotes;
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

    public get totalUpvotes(): number | null {
        return this._totalUpvotes;
    }
    public get totalDownvotes(): number | null {
        return this._totalDownvotes;
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

    public set totalUpvotes(value: number | null) {
        this._totalUpvotes = value;
    }
    public set totalDownvotes(value: number | null) {
        this._totalDownvotes = value;
    }

    public toString(): string {
        return `User: ${this._questionId} ${this._userId} ${this._questionTitle} ${this._questionBody} ${this._isClosed} ${this._totalUpvotes} ${this._totalDownvotes} ${this.createdAt} ${this.updatedAt}`;
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


    /**
     * Retrieve answers connected to a specific question from the database.
     *
     * @param {number} questionId - The ID of the question for which answers are to be retrieved.
     * @returns {Promise<AnswerWithUser[] | string>} A Promise resolving to either the retrieved answers or an error message.
     * @throws {Error} Throws an error if the retrieval operation fails.
     *
     * @description
     * This static method leverages the AnswerService to retrieve answers connected to a specific question from the database.
     * It handles the retrieval operation asynchronously and returns a Promise that resolves to either
     * an array of retrieved answers or an error message if the retrieval fails.
     *
     * @example
     * try {
     *   // Example: Retrieve answers for a specific question
     *   const questionId = exampleQuestionId;
     *   const answers = await Question.getAnswersForQuestion(questionId);
     *   console.log('Answers retrieved successfully:', answers);
     * } catch (error) {
     *   console.error('Failed to retrieve answers:', error.message);
     * }
     */
    public static async getAnswersForQuestion(questionId: number): Promise<AnswerWithUser[] | string> {
        try {
            // Calling the getAnswersForQuestion method from the service.
            return await AnswerService.getAnswersForQuestion(questionId);
        } catch (error) {
            // Handling any errors that occur during the process.
            return `Error retrieving answers: ${error}`;
        }
    }


    /**
     * Update the total upvotes for a question using the QuestionService.
     *
     * @param {number} questionId - The ID of the question to update.
     * @param {boolean} increment - If true, increment total upvotes by 1; if false, decrement by 1.
     * @returns {Promise<Question | string>} A Promise resolving to the updated question object or an error message.
     * @throws {Error} Throws an error if the update operation fails.
     *
     * @description
     * This static method calls the updateTotalUpvotes method from the QuestionService to update
     * the total upvotes for a question. It forwards the request to the service layer, handling any
     * errors that may occur during the process. The function returns a Promise that resolves to either
     * the updated question object or an error message.
     *
     * @example
     * // Example: Update total upvotes for a question by incrementing.
     * const questionIdToUpdate = 123;
     * try {
     *   const updatedQuestion = await Question.updateTotalUpvotes(questionIdToUpdate, true);
     *   console.log('Total upvotes updated successfully:', updatedQuestion);
     * } catch (error) {
     *   console.error('Failed to update total upvotes:', error);
     * }
     */
    public static async updateTotalUpvotes(questionId: number, increment: boolean): Promise<Question | string> {
        try {
            // Calling the updateTotalUpvotes method from the service.
            return await QuestionService.updateTotalUpvotes(questionId, increment);
        } catch (error) {
            // Handling any errors that occur during the process.
            return `Error updating question total upvotes: ${error}`;
        }
    }

    /**
     * Update the total downvotes for a question using the QuestionService.
     *
     * @param {number} questionId - The ID of the question to update.
     * @param {boolean} increment - If true, increment total downvotes by 1; if false, decrement by 1.
     * @returns {Promise<Question | string>} A Promise resolving to the updated question object or an error message.
     * @throws {Error} Throws an error if the update operation fails.
     *
     * @description
     * This static method calls the updateTotalDownvotes method from the QuestionService to update
     * the total downvotes for a question. It forwards the request to the service layer, handling any
     * errors that may occur during the process. The function returns a Promise that resolves to either
     * the updated question object or an error message.
     *
     * @example
     * // Example: Update total downvotes for a question by incrementing.
     * const questionIdToUpdate = 123;
     * try {
     *   const updatedQuestion = await Question.updateTotalDownvotes(questionIdToUpdate, true);
     *   console.log('Total downvotes updated successfully:', updatedQuestion);
     * } catch (error) {
     *   console.error('Failed to update total downvotes:', error);
     * }
     */
    public static async updateTotalDownvotes(questionId: number, increment: boolean): Promise<Question | string> {
        try {
            // Calling the updateTotalDownvotes method from the service.
            return await QuestionService.updateTotalDownvotes(questionId, increment);
        } catch (error) {
            // Handling any errors that occur during the process.
            return `Error updating question total downvotes: ${error}`;
        }
    }
}
