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
     * @returns {Promise<[Question]>} A Promise resolving to the saved question(s).
     * @throws {Error} Throws an error if the database query was not successful.
     */
    public static async saveQuestion(question: Question): Promise<[Question]> {
        // Querying the database with the new question data.
        const param: (string | number | boolean)[] = [question.userId, question.questionTitle, question.questionBody, question.isClosed];
        const questionQuery: [Question] = await api.queryDatabase(QUESTION_QUERY.CREATE_QUESTION, ...param) as [Question];

        // Checking if the database query was successful.
        if (!questionQuery) {
            // If the query was not successful, throw an error.
            throw new Error("Failed to create question in the database");
        }

        // Hiding the createQuestionForm and refreshing the page.
        return questionQuery;
    }

    /**
     * Update a question in the database.
     *
     * @param {Question} question - The question object containing the updated data.
     * @returns {Promise<[Question]>} A Promise resolving to the updated question(s).
     * @throws {Error} Throws an error if the database update was not successful.
     */
    public static async updateQuestion(question: Question): Promise<[Question]> {
        // Destructuring the question object to get individual properties
        const questionData: (string | number | boolean | null)[] = [question.questionTitle, question.questionBody, question.isClosed, question.questionId];

        // Querying the database to update the question with the given questionId.
        const updatedQuestion: [Question] = await api.queryDatabase(QUESTION_QUERY.UPDATE_QUESTION, ...questionData) as [Question];

        // Checking if the database update was successful.
        if (!updatedQuestion) {
            throw new Error(`Failed to update question with ID: ${question.questionId}`);
        }

        return updatedQuestion;
    }

    /**
     * Retrieve questions from the database based on certain criteria.
     *
     * @returns {Promise<[Question]>} A Promise resolving to the retrieved question(s).
     * @throws {Error} Throws an error if the database retrieval was not successful.
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
     */
    public static async retrieveQuestion(questionId: number): Promise<[Question]> {
        // Querying the database to retrieve the question with the given questionId.
        const getQuestion: [Question] = await api.queryDatabase(QUESTION_QUERY.SELECT_QUESTION, questionId) as [Question];

        // Checking if the database retrieval was successful.
        if (!getQuestion) {
            throw new Error(`Failed to retrieve question with ID: ${questionId}`);
        }

        return getQuestion;
    }

    /**
     * delete a question in the database.
     *
     * @returns {Promise<[Question]>} A Promise resolving to the deleted question.
     * @throws {Error} Throws an error if the database deletion was not successful.
     * @param questionId
     */
    public static async deleteQuestion(questionId: number): Promise<[Question]> {
        // Querying the database to delete the question with the given questionId.
        const newQuestion: [Question] = await api.queryDatabase(QUESTION_QUERY.DELETE_QUESTION, questionId) as [Question];

        // Checking if the database deletion was successful.
        if (!newQuestion) {
            throw new Error(`Failed to delete question with ID: ${questionId}`);
        }

        return newQuestion;
    }
}