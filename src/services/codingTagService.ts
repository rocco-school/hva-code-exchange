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
     * @returns {Promise<[CodingTag]>} A Promise resolving to the saved codingTag(s).
     * @throws {Error} Throws an error if the database query was not successful.
     * @param codingTag
     */
    public static async saveCodingTag(codingTag: CodingTag): Promise<[CodingTag]> {
        // Querying the database with the new codingTag data.
        const param: string[] = [codingTag.tagName, codingTag.tagDescription];
        const questionQuery: [CodingTag] = await api.queryDatabase(CODING_TAG_QUERY.CREATE_CODING_TAG, ...param) as [CodingTag];

        // Checking if the database query was successful.
        if (!questionQuery) {
            // If the query was not successful, throw an error.
            throw new Error("Failed to create question in the database");
        }

        // Hiding the createQuestionForm and refreshing the page.
        return questionQuery;
    }

    /**
     * Update a codingTag in the database.
     *
     * @returns {Promise<[CodingTag]>} A Promise resolving to the updated codingTag(s).
     * @throws {Error} Throws an error if the database update was not successful.
     * @param codingTag
     */
    public static async updateCodingTag(codingTag: CodingTag): Promise<[CodingTag]> {
        // Destructuring the codingTag object to get individual properties
        const codingTagData: (string | number | null)[] = [codingTag.tagDescription, codingTag.tagName, codingTag.tagId];

        // Querying the database to update the question with the given questionId.
        const updatedCodingTag: [CodingTag] = await api.queryDatabase(CODING_TAG_QUERY.UPDATE_CODING_TAG, ...codingTagData) as [CodingTag];

        // Checking if the database update was successful.
        if (!updatedCodingTag) {
            throw new Error(`Failed to update question with ID: ${codingTag.tagId}`);
        }

        return updatedCodingTag;
    }

    /**
     * Retrieve Coding tags from the database
     *
     * @returns {Promise<[CodingTag]>} A Promise resolving to the retrieved coding tag(s).
     * @throws {Error} Throws an error if the database retrieval was not successful.
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
     * @returns {Promise<[CodingTag]>} A Promise resolving to the retrieved Coding tag.
     * @throws {Error} Throws an error if the database retrieval was not successful.
     */
    public static async retrieveCodingTag(tagId: number): Promise<[CodingTag]> {
        // Querying the database to retrieve the coding tag with the given tagId.
        const getCodingTag: [CodingTag] = await api.queryDatabase(CODING_TAG_QUERY.SELECT_CODING_TAG, tagId) as [CodingTag];

        // Checking if the database retrieval was successful.
        if (!getCodingTag) {
            throw new Error(`Failed to retrieve Coding tag with ID: ${tagId}`);
        }

        return getCodingTag;
    }

    /**
     * delete a coding tag in the database.
     *
     * @returns {Promise<[Question]>} A Promise resolving to the deleted coding tag.
     * @throws {Error} Throws an error if the database deletion was not successful.
     * @param tagId
     */
    public static async deleteCodingTag(tagId: number): Promise<[CodingTag]> {
        // Querying the database to delete the codingTag with the given questionId.
        const deletedCodingTag: [CodingTag] = await api.queryDatabase(CODING_TAG_QUERY.DELETE_CODING_TAG, tagId) as [CodingTag];

        // Checking if the database deletion was successful.
        if (!deletedCodingTag) {
            throw new Error(`Failed to delete Coding tag with ID: ${tagId}`);
        }

        return deletedCodingTag;
    }
}