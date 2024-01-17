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
        const param: Array<any> = [answer.questionId, answer.userId, answer.answerBody];
        const newAnswer: any = await api.queryDatabase(ANSWER_QUERY.CREATE_ANSWER, ...param);

        // Retrieving the newly created answer from the database.
        const getAnswer: [Answer] = await api.queryDatabase(ANSWER_QUERY.SELECT_ANSWER, newAnswer.insertId) as [Answer];

        // Checking if the database query was successful.
        if (!getAnswer) {
            // If the query was not successful, throw an error.
            throw new Error("Failed to create answer in the database");
        }

        // Hiding the createAnswerForm and refreshing the page.
        return getAnswer[0] as Answer;
    }

    /**
     * Update an answer in the database.
     *
     * @param {Answer} answer - The answer object containing the updated data.
     * @returns {Promise<Answer>} A Promise resolving to the updated answer.
     * @throws {Error} Throws an error if the database update was not successful.
     *
     * @description
     * This static method updates an answer in the database using the provided answer object.
     * It destructures the answer object to extract individual properties and then queries the database
     * to perform the update. The method returns a Promise that resolves to the updated answer.
     */
    public static async updateAnswer(answer: Answer): Promise<Answer> {
        try {
            // Update the answer in the Answer table.
            const answerData: any[] = [answer.answerBody, answer.isAccepted, answer.answerId];
            await api.queryDatabase(ANSWER_QUERY.UPDATE_ANSWER, ...answerData);

            // Retrieve the updated answer from the database.
            const getAnswer: [Answer] = await api.queryDatabase(ANSWER_QUERY.SELECT_ANSWER, answer.answerId) as [Answer];

            // Checking if the database retrieval was successful.
            if (!getAnswer) {
                new Error(`Failed to get answer: ${answer.answerId}!`);
            }

            // Return the updated answer.
            return getAnswer[0] as Answer;
        } catch (error) {
            // Handle any errors that occur during the update or retrieval process.
            throw new Error(`Failed to update answer: ${answer.answerId}: ${error}`);
        }
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

        return getAnswer[0] as Answer;
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
     * @param {number} questionId - The ID of the question for which answers are to be retrieved.
     * @returns {Promise<[AnswerWithUser]>} A Promise resolving to the retrieved answer(s).
     * @throws {Error} Throws an error if the database retrieval was not successful.
     *
     * @description
     * This static method retrieves answers connected to a specific question from the database.
     * It queries the database to retrieve answers based on the provided question ID and returns
     * a Promise that resolves to an array of retrieved answers.
     */
    public static async getAnswersForQuestion(questionId: number): Promise<[AnswerWithUser]> {
        // Querying the database to retrieve answers for the specified question.
        const answers: [AnswerWithUser] = await api.queryDatabase(ANSWER_QUERY.GET_ANSWERS_AND_USERS_FROM_QUESTION, questionId) as [AnswerWithUser];

        // Checking if the database retrieval was successful.
        if (!answers) {
            throw new Error(`Failed to retrieve answers for question ${questionId} from Database!`);
        }

        return answers as [AnswerWithUser];
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


    /**
     * Retrieve answers connected to a specific question from the database.
     *
     * @param {number} questionId - The ID of the question for which answers are to be retrieved.
     * @returns {Promise<[AnswerWithUser]>} A Promise resolving to the retrieved answer(s).
     * @throws {Error} Throws an error if the database retrieval was not successful.
     *
     * @description
     * This static method retrieves answers connected to a specific question from the database.
     * It queries the database to retrieve answers based on the provided question ID and returns
     * a Promise that resolves to an array of retrieved answers.
     */
    public static async getAnswersByQuestionId(questionId: number): Promise<[Answer]> {
        // Querying the database to retrieve answers for the specified question.
        const answers: [Answer] = await api.queryDatabase(ANSWER_QUERY.GET_ANSWERS_FROM_QUESTION, questionId) as [Answer];

        // Checking if the database retrieval was successful.
        if (!answers) {
            throw new Error(`Failed to retrieve answers for question ${questionId} from Database!`);
        }

        return answers as [Answer];
    }


    /**
     * Update the total upvotes for an answer in the database.
     *
     * @param {number} answerId - The ID of the answer to update.
     * @param {boolean} increment - If true, increment total upvotes by 1; if false, decrement by 1.
     * @returns {Promise<Answer>} A Promise resolving to the updated answer object.
     * @throws {Error} Throws an error if the database update or retrieval fails.
     *
     * @description
     * This static method updates the total upvotes for an answer in the database by either incrementing or
     * decrementing by 1. It uses a parameterized query to perform the update operation and retrieves the
     * updated answer from the database. The function returns a Promise that resolves to the updated answer.
     */
    public static async updateTotalUpvotes(answerId: number, increment: boolean): Promise<Answer> {
        // Determine the update value based on the increment flag.
        const updateValue: number = increment ? 1 : -1;

        try {
            // Update the total_upvotes column in the Answer table.
            const params: Array<any> = [updateValue, answerId];
            await api.queryDatabase(ANSWER_QUERY.UPDATE_TOTAL_UPVOTES, ...params);

            // Retrieve the updated answer from the database.
            const answer: [Answer] = await api.queryDatabase(ANSWER_QUERY.SELECT_ANSWER, answerId) as [Answer];

            // Checking if the database retrieval was successful.
            if (!answer) {
                new Error(`Failed to get answer for ${answerId}!`);
            }

            return answer[0] as Answer;
        } catch (error) {
            // Handle any errors that occur during the update or retrieval process.
            throw new Error(`Failed to update total answer upvotes for ${answerId}: ${error}`);
        }
    }

    /**
     * Update the total downvotes for an answer in the database.
     *
     * @param {number} answerId - The ID of the answer to update.
     * @param {boolean} increment - If true, increment total downvotes by 1; if false, decrement by 1.
     * @returns {Promise<Answer>} A Promise resolving to the updated answer object.
     * @throws {Error} Throws an error if the database update or retrieval fails.
     *
     * @description
     * This static method updates the total downvotes for an answer in the database by either incrementing or
     * decrementing by 1. It uses a parameterized query to perform the update operation and retrieves the
     * updated answer from the database. The function returns a Promise that resolves to the updated answer.
     */
    public static async updateTotalDownvotes(answerId: number, increment: boolean): Promise<Answer> {
        // Determine the update value based on the increment flag.
        const updateValue: number = increment ? 1 : -1;

        try {
            // Update the total_downvotes column in the Answer table.
            const params: Array<any> = [updateValue, answerId];
            await api.queryDatabase(ANSWER_QUERY.UPDATE_TOTAL_DOWNVOTES, ...params);

            // Retrieve the updated answer from the database.
            const answer: [Answer] = await api.queryDatabase(ANSWER_QUERY.SELECT_ANSWER, answerId) as [Answer];

            // Checking if the database retrieval was successful.
            if (!answer) {
                new Error(`Failed to get answer for ${answerId}!`);
            }

            return answer[0] as Answer;
        } catch (error) {
            // Handle any errors that occur during the update or retrieval process.
            throw new Error(`Failed to update total answer downvotes for ${answerId}: ${error}`);
        }
    }
}