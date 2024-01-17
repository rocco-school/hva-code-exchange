import {api} from "@hboictcloud/api";
import {CodingTag} from "../models/codingTag";
import {CODING_TAG_QUERY} from "../query/codingTag.query";

/**
 * A service class for handling operations related to questions in the database.
 *
 * @class
 */
export class CodingTagService {

    /**
     * Save a codingTag to the database.
     *
     * @param {CodingTag} codingTag - The codingTag object to be saved.
     * @returns {Promise<CodingTag>} A Promise resolving to the saved codingTag.
     * @throws {Error} Throws an error if the database query was not successful.
     *
     * @description
     * This static method asynchronously saves a codingTag object to the database.
     * It queries the database with the provided codingTag data and returns a Promise
     * that resolves to the saved codingTag. If the database query is not successful,
     * it throws an error.
     */
    public static async saveCodingTag(codingTag: CodingTag): Promise<CodingTag> {
        // Querying the database with the new codingTag data.
        const param: string[] = [codingTag.tagName, codingTag.tagDescription];
        const newCodingTag: [CodingTag] = await api.queryDatabase(
            CODING_TAG_QUERY.CREATE_CODING_TAG,
            ...param
        ) as [CodingTag];

        // Checking if the database query was successful.
        if (!newCodingTag) {
            // If the query was not successful, throw an error.
            throw new Error("Failed to create codingTag in the database");
        }

        // Returning the saved codingTag.
        return newCodingTag[0];
    }

    /**
     * Update a codingTag in the database.
     *
     * @param {CodingTag} codingTag - The codingTag object containing the updated data.
     * @returns {Promise<CodingTag>} A Promise resolving to the updated codingTag.
     * @throws {Error} Throws an error if the database update was not successful.
     *
     * @description
     * This static method updates a codingTag object in the database with the provided data.
     * It queries the database to update the codingTag with the given tagId and returns a Promise
     * that resolves to the updated codingTag. If the database update is not successful, it throws an error.
     */
    public static async updateCodingTag(codingTag: CodingTag): Promise<CodingTag> {
        try {
            // Update the codingTag in the CodingTag table.
            const codingTagData: (string | number | null)[] = [codingTag.tagDescription, codingTag.tagName, codingTag.tagId];
            await api.queryDatabase(CODING_TAG_QUERY.UPDATE_CODING_TAG, ...codingTagData);

            // Retrieve the updated codingTag from the database.
            const getCodingTag: [CodingTag] = await api.queryDatabase(CODING_TAG_QUERY.SELECT_CODING_TAG, codingTag.tagId) as [CodingTag];

            // Checking if the database retrieval was successful.
            if (!getCodingTag) {
                new Error(`Failed to get codingTag: ${codingTag.tagId}!`);
            }

            // Return the updated codingTag.
            return getCodingTag[0];
        } catch (error) {
            // Handle any errors that occur during the update or retrieval process.
            throw new Error(`Failed to update codingTag: ${codingTag.tagId}: ${error}`);
        }
    }

    /**
     * Retrieve Coding tags from the database.
     *
     * @returns {Promise<[CodingTag]>} A Promise resolving to the retrieved coding tag(s).
     * @throws {Error} Throws an error if the database retrieval was not successful.
     *
     * @description
     * This static method queries the database to retrieve all coding tags.
     * It returns a Promise that resolves to an array of retrieved coding tags.
     * If the database retrieval is not successful, it throws an error.
     */
    public static async getCodingTags(): Promise<[CodingTag]> {
        // Querying the database to retrieve all coding tags.
        const codingTags: [CodingTag] = await api.queryDatabase(CODING_TAG_QUERY.SELECT_CODING_TAGS) as [CodingTag];

        // Checking if the database retrieval was successful.
        if (!codingTags) {
            throw new Error("Failed to retrieve coding tags from Database!");
        }

        return codingTags;
    }

    /**
     * Retrieve a Coding tag from the database.
     *
     * @param {number} tagId - The ID of the coding tag to be retrieved.
     * @returns {Promise<CodingTag>} A Promise resolving to the retrieved Coding tag.
     * @throws {Error} Throws an error if the database retrieval was not successful.
     *
     * @description
     * This static method queries the database to retrieve a specific coding tag with the given tagId.
     * It returns a Promise that resolves to the retrieved coding tag.
     * If the database retrieval is not successful, it throws an error.
     */
    public static async retrieveCodingTag(tagId: number): Promise<CodingTag> {
        // Querying the database to retrieve the coding tag with the given tagId.
        const getCodingTag: [CodingTag] = await api.queryDatabase(CODING_TAG_QUERY.SELECT_CODING_TAG, tagId) as [CodingTag];

        // Checking if the database retrieval was successful.
        if (!getCodingTag) {
            throw new Error(`Failed to retrieve Coding tag with ID: ${tagId}`);
        }

        // Returning the retrieved coding tag.
        return getCodingTag[0];
    }

    /**
     * Delete a coding tag in the database.
     *
     * @param {number} tagId - The ID of the coding tag to be deleted.
     * @returns {Promise<boolean>} A Promise resolving to the deleted coding tag.
     * @throws {Error} Throws an error if the database deletion was not successful.
     *
     * @description
     * This static method queries the database to delete a specific coding tag with the given tagId.
     * It returns a Promise that resolves to a boolean indicating whether the deletion was successful.
     * If the database deletion is not successful, it throws an error.
     */
    public static async deleteCodingTag(tagId: number): Promise<boolean> {
        // Querying the database to delete the codingTag with the given tagId.
        const deletedCodingTag: any = await api.queryDatabase(CODING_TAG_QUERY.DELETE_CODING_TAG, tagId) as any;

        // Checking if the database deletion was successful.
        if (deletedCodingTag.affectedRows === 0) {
            return false; // No rows affected, indicating the codingTag was not found.
        }

        if (deletedCodingTag.affectedRows > 0) {
            return true; // Deletion successful.
        }

        // If affectedRows is not 0 or greater than 0, something unexpected happened.
        throw new Error(`Failed to delete codingTag with ID: ${tagId}`);
    }


    /**
     * Retrieves all coding tags associated with a specific question from the database.
     *
     * @param {number} questionId - The ID of the question for which coding tags are to be retrieved.
     * @returns {Promise<[CodingTag]>} - A promise that resolves to an array of coding tags.
     * @throws {Error} - Throws an error if the database retrieval fails.
     *
     * @description
     * This static method queries the database to delete a specific coding tag with the given tagId.
     * It returns a Promise that resolves to a boolean indicating whether the deletion was successful.
     * If the database deletion is not successful, it throws an error.
     */
    public static async getAllCodingTagsForQuestion(questionId: number): Promise<[CodingTag]> {
        // Querying the database to get coding tags associated with the question.
        const codingTags: any = await api.queryDatabase(CODING_TAG_QUERY.GET_CODING_TAGS_BY_QUESTION_ID, questionId) as any;

        // Extracting unique tagIds from the result.
        const uniqueTagIds: any = [...new Set(codingTags.map((item: { tagId: any; }) => item.tagId))];

        // Fetching coding tags for each unique tagId.
        const tagsArray: [CodingTag] = await Promise.all(
            uniqueTagIds.map(async (tagId: any) => {
                const codingTag: string | CodingTag = await CodingTag.retrieveCodingTag(tagId);
                return codingTag;
            })
        ) as [CodingTag];

        // Checking if the database retrieval was successful.
        if (!tagsArray) {
            throw new Error(`Failed to retrieve Coding tags with questionID: ${questionId}`);
        }

        // Returning the retrieved coding tags.
        return tagsArray;
    }


    /**
     * Remove all coding tags associated with a specific question from the database.
     *
     * @param {number} questionId - The ID of the question for which coding tags are to be removed.
     * @returns {Promise<boolean>} - A Promise resolving to a boolean indicating the success of the removal.
     * @throws {Error} - Throws an error if there is an issue with the database removal process.
     *
     * @description
     * This static method queries the database to remove all coding tags associated with a specific question.
     * It returns a Promise that resolves to a boolean indicating whether the removal was successful.
     * If the database removal is not successful, it throws an error.
     */
    public static async removeAllQuestionTags(questionId: number): Promise<boolean> {
        // Querying the database to remove all coding tags associated with the question.
        const deletedQuestionTags: any = await api.queryDatabase(
            CODING_TAG_QUERY.DELETE_ALL_QUESTION_TAGS_BY_QUESTION_ID,
            questionId
        ) as any;

        console.log(deletedQuestionTags);

        // Checking if the database removal was successful.
        if (deletedQuestionTags.affectedRows === 0) {
            return false; // No rows affected, indicating no coding tags were found for the question.
        }

        if (deletedQuestionTags.affectedRows > 0) {
            return true; // Removal successful.
        }

        // If affectedRows is not 0 or greater than 0, something unexpected happened.
        throw new Error(`Failed to remove question tags with questionId: ${questionId}`);
    }
}