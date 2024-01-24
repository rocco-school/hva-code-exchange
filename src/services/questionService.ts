import {Question} from "../models/question";
import {api} from "@hboictcloud/api";
import {QUESTION_QUERY} from "../query/question.query";
import { Answer } from "../models/answer";

/**
 * A service class for handling operations related to questions in the database.
 *
 * @class
 */
export class QuestionService {
    /**
     * Save a question to the database.
     *
     * @param {Question} question - The question object to be saved.
     * @returns {Promise<Question>} A Promise resolving to the saved question.
     * @throws {Error} Throws an error if the database query was not successful.
     *
     * @description
     * This static method saves a new question to the database using the provided question object.
     * If the questionId is null, it indicates a new question, and the database will auto-increment the ID.
     * It queries the database to create a new question and returns a Promise that resolves to the saved question.
     */
    public static async saveQuestion(question: Question): Promise<Question> {
        // Querying the database with the new question data.
        const param: (string | number | boolean | null)[] = [question.userId, question.questionTitle, question.questionBody, question.isClosed];
        const newQuestion: any = await api.queryDatabase(QUESTION_QUERY.CREATE_QUESTION, ...param);

        // Retrieving the newly created question from the database.
        const getQuestion: [Question] = await api.queryDatabase(QUESTION_QUERY.SELECT_QUESTION, newQuestion.insertId) as [Question];

        // Checking if the database query was successful.
        if (!getQuestion) {
            // If the query was not successful, throw an error.
            throw new Error("Failed to create question in the database");
        }

        // Hiding the createQuestionForm and refreshing the page.
        return getQuestion[0] as Question;
    }

    /**
     * Update a question in the database.
     *
     * @param {Question} question - The question object containing the updated data.
     * @returns {Promise<Question>} A Promise resolving to the updated question.
     * @throws {Error} Throws an error if the database update was not successful.
     *
     * @description
     * This static method updates a question in the database using the provided question object.
     * It destructures the question object to extract individual properties and then queries the database
     * to perform the update. The method returns a Promise that resolves to the updated question.
     */
    public static async updateQuestion(question: Question): Promise<Question> {
        try {
            // Update the question in the Question table.
            const questionData: (string | number | boolean | null)[] = [question.userId, question.questionTitle, question.questionBody, question.isClosed, question.questionId];
            await api.queryDatabase(QUESTION_QUERY.UPDATE_QUESTION, ...questionData);

            // Retrieve the updated question from the database.
            const getQuestion: [Question] = await api.queryDatabase(QUESTION_QUERY.SELECT_QUESTION, question.questionId) as [Question];

            // Checking if the database retrieval was successful.
            if (!getQuestion) {
                new Error(`Failed to get question: ${question.questionId}!`);
            }

            // Return the updated question.
            return getQuestion[0] as Question;
        } catch (error) {
            // Handle any errors that occur during the update or retrieval process.
            throw new Error(`Failed to update question: ${question.questionId}: ${error}`);
        }
    }

    /**
     * Retrieve questions from the database based on certain criteria.
     *
     * @returns {Promise<[Question]>} A Promise resolving to the retrieved question(s).
     * @throws {Error} Throws an error if the database retrieval was not successful.
     *
     * @description
     * This static method retrieves questions from the database based on certain criteria.
     * It queries the database to retrieve all questions and returns a Promise that resolves to
     * an array of retrieved questions.
     */
    public static async getQuestions(): Promise<[Question]> {
        // Querying the database to retrieve all questions.
        const questions: [Question] = await api.queryDatabase(QUESTION_QUERY.SELECT_QUESTIONS) as [Question];

        // Checking if the database retrieval was successful.
        if (!questions) {
            throw new Error("Failed to retrieve questions from Database!");
        }

        return questions as [Question];
    }

    /**
     * Retrieve a question from the database.
     *
     * @param {number} questionId - The ID of the question to be retrieved.
     * @returns {Promise<[Question]>} A Promise resolving to the retrieved question.
     * @throws {Error} Throws an error if the database retrieval was not successful.
     *
     * @description
     * This static method retrieves a specific question from the database based on its ID.
     * It queries the database to retrieve the question with the given questionId and returns
     * a Promise that resolves to the retrieved question.
     */
    public static async retrieveQuestion(questionId: number): Promise<Question> {
        // Querying the database to retrieve the question with the given questionId.
        const getQuestion: [Question] = await api.queryDatabase(QUESTION_QUERY.SELECT_QUESTION, questionId) as [Question];

        // Checking if the database retrieval was successful.
        if (!getQuestion) {
            throw new Error(`Failed to retrieve question with ID: ${questionId}`);
        }

        return getQuestion[0] as Question;
    }

    /**
     * Inserts tags for a given question into the database.
     *
     * @param {number} questionId - The ID of the question.
     * @param {number[]} tagIds - An array of tag IDs to associate with the question.
     * @returns {Promise<boolean>} A Promise resolving to true upon successful insertion.
     * @throws {Error} Throws an error if the database insertion was not successful.
     *
     * @description
     * This static method inserts tags for a specific question into the database.
     * It iterates through the array of tag IDs and queries the database to create associations between
     * the question and each tag. It returns a Promise that resolves to true upon successful insertion.
     */
    public static async insertQuestionTag(questionId: number, tagIds: number[]): Promise<boolean> {
        for (const tagId of tagIds) {
            const questionTagData: [number, number] = [questionId, tagId];

            // Query the database to insert the question-tag association.
            const createdQuestionTag: any = await api.queryDatabase(
                QUESTION_QUERY.CREATE_QUESTION_TAG,
                ...questionTagData
            ) as any;

            // Check if the database insertion was successful.
            if (!createdQuestionTag) {
                throw new Error(`Failed to insert question tags for question with ID: ${questionId}`);
            }
        }
        return true;
    }

    /**
     * Delete a question in the database.
     *
     * @param {number} questionId - The ID of the question to be deleted.
     * @returns {Promise<boolean>} A Promise resolving to the deletion status.
     * @throws {Error} Throws an error if the database deletion was not successful.
     *
     * @description
     * This static method deletes a specific question from the database based on its ID.
     * It queries the database to delete the question with the given questionId and returns
     * a Promise that resolves to a boolean indicating whether the deletion was successful.
     */
    public static async deleteQuestion(questionId: number): Promise<boolean> {
        // Querying the database to delete the question with the given questionId.
        const deleteQuestion: any = await api.queryDatabase(QUESTION_QUERY.DELETE_QUESTION, questionId) as any;

        // Checking if the database deletion was successful.
        if (deleteQuestion.affectedRows === 0) {
            return false; // No rows affected, indicating the question was not found.
        }

        if (deleteQuestion.affectedRows > 0) {
            return true; // Deletion successful.
        }

        // If affectedRows is not 0 or greater than 0, something unexpected happened.
        throw new Error(`Failed to delete question with ID: ${questionId}`);
    }

    /**
     * Retrieve questions connected to a specific question from the database.
     *
     * @param {string} userId - The ID of the question for which answers are to be retrieved.
     * @returns {Promise<[AnswerWithUser]>} A Promise resolving to the retrieved answer(s).
     * @throws {Error} Throws an error if the database retrieval was not successful.
     *
     * @description
     * This static method retrieves answers connected to a specific question from the database.
     * It queries the database to retrieve answers based on the provided question ID and returns
     * a Promise that resolves to an array of retrieved answers.
     */
    public static async getQuestionsCountByUser(userId: number): Promise<number> {
        // Querying the database to retrieve questions for the specified question.
        const questions: any = await api.queryDatabase(QUESTION_QUERY.GET_TOTAL_QUESTIONS_BY_USER, userId);

        // Checking if the database retrieval was successful.
        if (!questions) {
            throw new Error(`Failed to retrieve total question count for user ${userId} from Database!`);
        }

        return questions[0].totalQuestions;
    }


    /**
     * Update the total upvotes for a question in the database.
     *
     * @param {number} questionId - The ID of the question to update.
     * @param {boolean} increment - If true, increment total upvotes by 1; if false, decrement by 1.
     * @returns {Promise<Question>} A Promise resolving to the updated question object.
     * @throws {Error} Throws an error if the database update or retrieval fails.
     *
     * @description
     * This static method updates the total upvotes for a question in the database by either incrementing or
     * decrementing by 1. It uses a parameterized query to perform the update operation and retrieves the
     * updated question from the database. The function returns a Promise that resolves to the updated question.
     */
    public static async updateTotalUpvotes(questionId: number, increment: boolean): Promise<Question> {
        // Determine the update value based on the increment flag.
        const updateValue: number = increment ? 1 : -1;

        try {
            // Update the total_upvotes column in the Question table.
            const params: number[] = [updateValue, questionId];
            await api.queryDatabase(QUESTION_QUERY.UPDATE_TOTAL_UPVOTES, ...params);

            // Retrieve the updated question from the database.
            const question: [Question] = await api.queryDatabase(QUESTION_QUERY.SELECT_QUESTION, questionId) as [Question];

            // Checking if the database retrieval was successful.
            if (!question) {
                new Error(`Failed to get question for ${questionId}!`);
            }

            return question[0] as Question;
        } catch (error) {
            // Handle any errors that occur during the update or retrieval process.
            throw new Error(`Failed to update total question upvotes for ${questionId}: ${error}`);
        }
    }

    /**
     * Update the total downvotes for a question in the database.
     *
     * @param {number} questionId - The ID of the question to update.
     * @param {boolean} increment - If true, increment total downvotes by 1; if false, decrement by 1.
     * @returns {Promise<Question>} A Promise resolving to the updated question object.
     * @throws {Error} Throws an error if the database update or retrieval fails.
     *
     * @description
     * This static method updates the total downvotes for a question in the database by either incrementing or
     * decrementing by 1. It uses a parameterized query to perform the update operation and retrieves the
     * updated question from the database. The function returns a Promise that resolves to the updated question.
     */
    public static async updateTotalDownvotes(questionId: number, increment: boolean): Promise<Question> {
        // Determine the update value based on the increment flag.
        const updateValue: number = increment ? 1 : -1;

        try {
            // Update the total_downvotes column in the Question table.
            const params: number[] = [updateValue, questionId];
            await api.queryDatabase(QUESTION_QUERY.UPDATE_TOTAL_DOWNVOTES, ...params);

            // Retrieve the updated question from the database.
            const question: [Question] = await api.queryDatabase(QUESTION_QUERY.SELECT_QUESTION, questionId) as [Question];

            // Checking if the database retrieval was successful.
            if (!question) {
                new Error(`Failed to get question for ${questionId}!`);
            }

            return question[0] as Question;
        } catch (error) {
            // Handle any errors that occur during the update or retrieval process.
            throw new Error(`Failed to update total question downvotes for ${questionId}: ${error}`);
        }
    }


    /**
     * Gets the maximum number of question pages from the database.
     *
     * @returns {Promise<number>} A Promise resolving to the maximum number of question pages.
     * @throws {Error} Throws an error if the database retrieval fails.
     *
     * @description
     * This static method retrieves the maximum number of question pages from the database using a specified query.
     * It returns a Promise that resolves to the maximum number of question pages.
     */
    public static async getMaxQuestionPages(itemsPerPage: number): Promise<number> {
        // Querying the database to retrieve questions for the specified question.
        const maxPages: any = await api.queryDatabase(QUESTION_QUERY.GET_MAX_QUESTION_PAGES, itemsPerPage);

        // Checking if the database retrieval was successful.
        if (!maxPages) {
            throw new Error("Failed to retrieve max pages for question from the Database!");
        }

        return maxPages[0]["max_pages"];
    }

    /**
     * Retrieves questions associated with a specific user from the database using the provided user ID.
     *
     * @param {number} userId - The unique identifier of the user.
     * @returns {Promise<[Question]>} A Promise resolving to an array of questions for the specified user.
     * @throws {Error} Throws an error if the retrieval operation fails or if no questions are found.
     *
     * @description
     * This static method queries the database using the `api` service and the `QUESTION_QUERY.GET_QUESTIONS_BY_USER`
     * query to retrieve questions associated with a specific user. It expects the result to be an array of questions
     * and handles the case where no questions are found. The function returns a Promise that resolves to the array of questions.
     */
    public static async getMostRecentQuestionByUser(userId: number): Promise<[Question]> {
        try {
            // Query the database using the provided user ID.
            const question: [Question] = await api.queryDatabase(QUESTION_QUERY.GET_RECENT_QUESTIONS_BY_USER, userId) as [Question];

            if (!question) {
                // Throw an error if no questions are found for the specified user.
                throw new Error(`Failed to get question for user with ID ${userId}!`);
            }

            return question;
        } catch (error) {
            // Forward any errors that occur during the database query.
            throw new Error(`Error retrieving questions for user with ID ${userId}: ${error}`);
        }
    }

    public static async getMostRecentQuestionsByAnswer(userId: number | null): Promise<[Question]> {
        try {
            const question: [Question] = await api.queryDatabase(QUESTION_QUERY.SELECT_QUESTION_BY_ANSWER_ID, userId) as [Question];

            if (!question) {
                throw new Error(`Failed to get questions for user with ID ${userId}!`);
            }
            
            return question;
        } catch (error) {
            throw new Error(`Error retrieving questions for user with ID ${userId}: ${error}`);
        }
    }

}