import {api} from "@hboictcloud/api";
import {Answer} from "../models/answer";
import {ANSWER_QUERY} from "../query/answer.query";
import {AnswerWithUser} from "../models/interface/answerWithUser";

/**
 * A service class for handling operations related to answers in the database.
 *
 * @class
 */
export class AnswerService {
    /**
     * Save an answer to the database.
     *
     * @param {Answer} answer - The answer object to be saved.
     * @returns {Promise<Answer>} A Promise resolving to the saved answer.
     * @throws {Error} Throws an error if the database query was not successful.
     *
     * @description
     * This static method saves a new answer to the database using the provided answer object.
     * If the answerId is null, it indicates a new answer, and the database will auto-increment the ID.
     * It queries the database to create a new answer and returns a Promise that resolves to the saved answer.
     */
    public static async saveAnswer(answer: Answer): Promise<Answer> {
        // Querying the database with the new answer data.
        const param: (string | number | boolean | null)[] = [answer.questionId, answer.userId, answer.answerBody];
        const newAnswer: any = await api.queryDatabase(ANSWER_QUERY.CREATE_ANSWER, ...param);

        // Retrieving the newly created answer from the database.
        const getAnswer: [Answer] = await api.queryDatabase(ANSWER_QUERY.SELECT_ANSWER, newAnswer.insertId) as [Answer];

        // Checking if the database query was successful.
        if (!getAnswer) {
            // If the query was not successful, throw an error.
            throw new Error("Failed to create answer in the database");
        }

        // Hiding the createAnswerForm and refreshing the page.
        return getAnswer[0];
    }

    /**
     * Update an answer in the database.
     *
     * @param {Answer} answer - The answer object containing the updated data.
     * @returns {Promise<Answer>} A Promise resolving to the updated answer.
     * @throws {Error} Throws an error if the database update was not successful.
     *
     * @description
     * This static method updates a answer in the database using the provided answer object.
     * It destructures the answer object to extract individual properties and then queries the database
     * to perform the update. The method returns a Promise that resolves to the updated answer.
     */
    public static async updateAnswer(answer: Answer): Promise<Answer> {
        // Destructuring the answer object to get individual properties
        const answerData: (string | number | boolean | null)[] = [answer.questionId, answer.userId, answer.answerBody];

        // Querying the database to update the answer with the given answerId.
        const updatedAnswer: [Answer] = await api.queryDatabase(ANSWER_QUERY.UPDATE_ANSWER, ...answerData) as [Answer];

        // Checking if the database update was successful.
        if (!updatedAnswer) {
            throw new Error(`Failed to update answer with ID: ${answer.answerId}`);
        }

        return updatedAnswer[0];
    }

    /**
     * Retrieve an answer from the database.
     *
     * @param {number} answerId - The ID of the answer to be retrieved.
     * @returns {Promise<[Answer]>} A Promise resolving to the retrieved answer.
     * @throws {Error} Throws an error if the database retrieval was not successful.
     *
     * @description
     * This static method retrieves a specific answer from the database based on its ID.
     * It queries the database to retrieve the answer with the given answerId and returns
     * a Promise that resolves to the retrieved answer.
     */
    public static async retrieveAnswer(answerId: number): Promise<Answer> {
        // Querying the database to retrieve the answer with the given answerId.
        const getAnswer: [Answer] = await api.queryDatabase(ANSWER_QUERY.SELECT_ANSWER, answerId) as [Answer];

        // Checking if the database retrieval was successful.
        if (!getAnswer) {
            throw new Error(`Failed to retrieve answer with ID: ${answerId}`);
        }

        return getAnswer[0];
    }

    /**
     * Delete an answer in the database.
     *
     * @param {number} answerId - The ID of the answer to be deleted.
     * @returns {Promise<boolean>} A Promise resolving to the deletion status.
     * @throws {Error} Throws an error if the database deletion was not successful.
     *
     * @description
     * This static method deletes a specific answer from the database based on its ID.
     * It queries the database to delete the answer with the given answer and returns
     * a Promise that resolves to a boolean indicating whether the deletion was successful.
     */
    public static async deleteAnswer(answerId: number): Promise<boolean> {
        // Querying the database to delete the answer with the given answerId.
        const deleteAnswer: any = await api.queryDatabase(ANSWER_QUERY.DELETE_ANSWER, answerId) as any;

        // Checking if the database deletion was successful.
        if (deleteAnswer.affectedRows === 0) {
            return false; // No rows affected, indicating the answer was not found.
        }

        if (deleteAnswer.affectedRows > 0) {
            return true; // Deletion successful.
        }

        // If affectedRows is not 0 or greater than 0, something unexpected happened.
        throw new Error(`Failed to delete answer with ID: ${answerId}`);
    }

    /**
     * Retrieve answers connected to a specific question from the database.
     *
     * @param {string} questionId - The ID of the question for which answers are to be retrieved.
     * @returns {Promise<[AnswerWithUser]>} A Promise resolving to the retrieved answer(s).
     * @throws {Error} Throws an error if the database retrieval was not successful.
     *
     * @description
     * This static method retrieves answers connected to a specific question from the database.
     * It queries the database to retrieve answers based on the provided question ID and returns
     * a Promise that resolves to an array of retrieved answers.
     */
    public static async getAnswersForQuestion(questionId: string): Promise<[AnswerWithUser]> {
        // Querying the database to retrieve answers for the specified question.
        const answers: [AnswerWithUser] = await api.queryDatabase(ANSWER_QUERY.GET_ANSWERS_AND_USERS_FROM_QUESTION, questionId) as [AnswerWithUser];

        // Checking if the database retrieval was successful.
        if (!answers) {
            throw new Error(`Failed to retrieve answers for question ${questionId} from Database!`);
        }

        return answers;
    }

    /**
     * Retrieve answers connected to a specific question from the database.
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
    public static async getAnswersCountByUser(userId: number): Promise<number> {
        // Querying the database to retrieve answers for the specified question.
        const answers: any = await api.queryDatabase(ANSWER_QUERY.GET_TOTAL_ANSWERS_BY_USER, userId);

        // Checking if the database retrieval was successful.
        if (!answers) {
            throw new Error(`Failed to retrieve total answer count for user ${userId} from Database!`);
        }

        return answers[0].totalAnswers;
    }
}