import {Question} from "../models/question";
import {api} from "@hboictcloud/api";
import {QUESTION_QUERY} from "../query/question.query";

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
        return getQuestion[0];
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
        // Destructuring the question object to get individual properties
        const questionData: (string | number | boolean | null)[] = [question.questionTitle, question.questionBody, question.isClosed, question.questionId];

        // Querying the database to update the question with the given questionId.
        const updatedQuestion: [Question] = await api.queryDatabase(QUESTION_QUERY.UPDATE_QUESTION, ...questionData) as [Question];

        // Checking if the database update was successful.
        if (!updatedQuestion) {
            throw new Error(`Failed to update question with ID: ${question.questionId}`);
        }

        return updatedQuestion[0];
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

        return questions;
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

        return getQuestion[0];
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
}