import {Question} from "../../models/question";
import {api} from "@hboictcloud/api";
import {QUESTION_QUERY} from "../../query/question.query";

/**
 * Retrieves a question from the database by question ID.
 * @returns {Promise<User>} A Promise that resolves to the question object if found, otherwise resolves to undefined.
 * @param questionId
 */
export async function getQuestion(questionId: number): Promise<Question | undefined> {
    try {
        // Use the API to query the database and retrieve user information.
        const questionArray: [Question] = await api.queryDatabase(QUESTION_QUERY.SELECT_QUESTION, questionId) as [Question];

        // If the user is not found, the function resolves to undefined.
        if (questionArray.length <= 0) return undefined;

        // Return the first user from the array
        return questionArray[0] as Question;
    } catch (error) {
        // Log any errors that occur during the database query.
        console.error(`Error while retrieving user with ID ${questionId}:`, error);
        // Propagate the error so the caller can handle it if needed.
        throw error;
    }
}