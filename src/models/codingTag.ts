import {CodingTagService} from "../services/codingTagService";

export class CodingTag {
    // private fields
    private _tagId: number | null;
    private _tagName: string;
    private _tagDescription: string;

    // The constructor is called once when the class is instantiated.
    // This constructor fills the fields when creating an object.
    public constructor(tagId: number | null, tagName: string, tagDescription: string) {
        this._tagId = tagId;
        this._tagName = tagName;
        this._tagDescription = tagDescription;
    }

    // Getters en setters
    public get tagId(): number | null {
        return this._tagId;
    }

    public get tagName(): string {
        return this._tagName;
    }

    public get tagDescription(): string {
        return this._tagDescription;
    }

    public set tagId(value: number | null) {
        this._tagId = value;
    }

    public set tagName(value: string) {
        this._tagName = value;
    }

    public set tagDescription(value: string) {
        this._tagDescription = value;
    }

    public toString(): string {
        return `CodingTag: ${this._tagId} ${this._tagName} ${this._tagDescription}`;
    }

    /**
     * Saves the codingTag to the database using the service.
     *
     * @returns {Promise<CodingTag | string>} A Promise resolving to either the saved codingTag or an error message.
     * @throws {Error} Throws an error if the save operation fails.
     *
     * @description
     * This method asynchronously saves the current codingTag instance to the database
     * using the CodingTagService. It returns a Promise that resolves to either the saved codingTag
     * or an error message if the save operation fails.
     *
     * @example
     * // Example: Save a codingTag instance to the database
     * const codingTagInstance: CodingTag = new CodingTag(
     *   null, // tagId is null for a new codingTag (auto_increment in the database)
     *   'TagName',
     *   'TagDescription',
     * );
     *
     * try {
     *   const savedCodingTag = await codingTagInstance.saveCodingTag();
     *   console.log('Coding tag saved successfully:', savedCodingTag);
     * } catch (error) {
     *   console.error('Error saving Coding tag:', error.message);
     * }
     */
    public async saveCodingTag(): Promise<CodingTag | string> {
        try {
            // Calling the saveCodingTag method from the service.
            return await CodingTagService.saveCodingTag(this);
        } catch (error) {
            // Handling any errors that occur during the process.
            return `Error saving Coding tag: ${error}`;
        }
    }

    /**
     * Updates the Coding Tag in the database using the service.
     *
     * @returns {Promise<CodingTag | string>} A Promise resolving to either the updated Coding Tag or an error message.
     * @throws {Error} Throws an error if the update operation fails.
     *
     * @description
     * This method asynchronously updates the current codingTag instance in the database
     * using the CodingTagService. It returns a Promise that resolves to either the updated codingTag
     * or an error message if the update operation fails.
     *
     * @example
     * // Example: Update a codingTag instance in the database
     * const codingTagInstance = new CodingTag(tagId, 'TagName', 'TagDescription');
     * try {
     *   const updatedCodingTag = await codingTagInstance.updateCodingTag();
     *   console.log('Coding tag updated successfully:', updatedCodingTag);
     * } catch (error) {
     *   console.error('Error updating Coding tag:', error.message);
     * }
     */
    public async updateCodingTag(): Promise<CodingTag | string> {
        try {
            // Calling the updateCodingTag method from the service.
            return await CodingTagService.updateCodingTag(this);
        } catch (error) {
            // Handling any errors that occur during the process.
            return `Error updating Coding tag: ${error}`;
        }
    }

    /**
     * Retrieves coding tags from the database using the service.
     *
     * @returns {Promise<CodingTag[] | string>} A Promise resolving to either the retrieved coding tags or an error message.
     * @throws {Error} Throws an error if the retrieval operation fails.
     *
     * @description
     * This static method leverages the CodingTagService to retrieve coding tags from the database.
     * It handles the retrieval operation asynchronously and returns a Promise that resolves to either
     * an array of retrieved coding tags or an error message if the retrieval fails.
     *
     * @example
     * // Example: Retrieve coding tags from the database
     * try {
     *   const codingTags = await CodingTag.getCodingTags();
     *   console.log('Coding tags retrieved successfully:', codingTags);
     * } catch (error) {
     *   console.error('Failed to retrieve coding tags:', error.message);
     * }
     */
    public static async getCodingTags(): Promise<CodingTag[] | string> {
        try {
            // Calling the getQuestions method from the service.
            return await CodingTagService.getCodingTags();
        } catch (error) {
            // Handling any errors that occur during the process.
            return `Error retrieving coding tags: ${error}`;
        }
    }


    /**
     * Retrieves a Coding tag from the database using the service.
     *
     * @param {number} tagId - The ID of the coding tag to retrieve.
     * @returns {Promise<CodingTag | string>} A Promise resolving to either the retrieved coding tag or an error message.
     * @throws {Error} Throws an error if the retrieval operation fails.
     *
     * @description
     * This static method leverages the CodingTagService to retrieve a specific coding tag from the database.
     * It handles the retrieval operation asynchronously and returns a Promise that resolves to either
     * the retrieved coding tag or an error message if the retrieval fails.
     *
     * @example
     * // Example: Retrieve a specific coding tag from the database
     * try {
     *   const codingTag = await CodingTag.retrieveCodingTag(tagId);
     *   console.log('Coding tag retrieved successfully:', codingTag);
     * } catch (error) {
     *   console.error('Failed to retrieve coding tag:', error.message);
     * }
     */
    public static async retrieveCodingTag(tagId: number): Promise<CodingTag | string> {
        try {
            // Calling the retrieveCodingTag method from the service.
            return await CodingTagService.retrieveCodingTag(tagId);
        } catch (error) {
            // Handling any errors that occur during the process.
            return `Error retrieving coding tag: ${error}`;
        }
    }

    /**
     * Deletes a coding tag from the database using the service.
     *
     * @param {number} tagId - The ID of the coding tag to delete.
     * @returns {Promise<boolean | string>} A Promise resolving to either delete the coding tag or an error message.
     * @throws {Error} Throws an error if the deletion operation fails.
     *
     * @description
     * This static method leverages the CodingTagService to delete a specific coding tag from the database.
     * It handles the deletion operation asynchronously and returns a Promise that resolves to either
     * a boolean indicating success or an error message if the deletion fails.
     *
     * @example
     * // Example: Delete a specific coding tag from the database
     * try {
     *   const isDeleted = await CodingTag.deleteCodingTag(tagId);
     *   console.log('Coding tag deletion successful:', isDeleted);
     * } catch (error) {
     *   console.error('Failed to delete coding tag:', error.message);
     * }
     */
    public static async deleteCodingTag(tagId: number): Promise<boolean | string> {
        try {
            // Calling the deleteQuestion method from the service.
            return await CodingTagService.deleteCodingTag(tagId);
        } catch (error) {
            // Handling any errors that occur during the process.
            return `Error deleting coding tag: ${error}`;
        }
    }


    /**
     * Retrieves all coding tags associated with a specific question using the CodingTagService.
     *
     * @param {number} questionId - The ID of the question for which coding tags are to be retrieved.
     * @returns {Promise<[CodingTag] | string>} - A Promise resolving to an array of coding tags or an error message.
     * @throws {Error} - Throws an error if there is an issue with the retrieval process.
     *
     * @description
     * This static method leverages the CodingTagService to retrieve all coding tags associated with a specific question.
     * It handles the retrieval operation asynchronously and returns a Promise that resolves to either an array of coding tags
     * or an error message if there is an issue with the retrieval process.
     *
     * @example
     * // Example: Retrieve coding tags for a specific question
     * try {
     *   const codingTags = await CodingTag.getAllCodingTagsForQuestion(questionId);
     *   console.log('Retrieved coding tags:', codingTags);
     * } catch (error) {
     *   console.error('Error retrieving coding tags:', error.message);
     * }
     */
    public static async getAllCodingTagsForQuestion(questionId: number): Promise<[CodingTag] | string> {
        try {
            // Calling the getAllCodingTagsForQuestion method from the service.
            return await CodingTagService.getAllCodingTagsForQuestion(questionId);
        } catch (error) {
            // Handling any errors that occur during the process.
            return `Error retrieving coding tags: ${error}`;
        }
    }


    /**
     * Remove all coding tags associated with a specific question using the CodingTagService.
     *
     * @param {number} questionId - The ID of the question for which coding tags are to be removed.
     * @returns {Promise<boolean | string>} - A Promise resolving to a boolean indicating the success of the removal or an error message.
     * @throws {Error} - Throws an error if there is an issue with the removal process.
     *
     * @description
     * This static method leverages the CodingTagService to remove all coding tags associated with a specific question.
     * It handles the removal operation asynchronously and returns a Promise that resolves to either a boolean indicating
     * the success of the removal or an error message if there is an issue with the removal process.
     *
     * @example
     * // Example: Remove all coding tags associated with a specific question
     * const questionIdToRemoveTags = 123;
     * try {
     *   const isRemoved = await CodingTag.removeAllQuestionTags(questionIdToRemoveTags);
     *   console.log('Question tags removal successful:', isRemoved);
     * } catch (error) {
     *   console.error('Failed to remove question tags:', error.message);
     * }
     */
    public static async removeAllQuestionTags(questionId: number): Promise<boolean | string> {
        try {
            // Calling the removeAllQuestionTags method from the service.
            return await CodingTagService.removeAllQuestionTags(questionId);
        } catch (error) {
            // Handling any errors that occur during the process.
            return `Error removing question tags: ${error}`;
        }
    }


    /**
     * Removes all coding tags associated with a specific user using the CodingTagService.
     *
     * @param {number} userId - The ID of the user for whom coding tags are to be removed.
     * @returns {Promise<boolean | string>} - A Promise resolving to a boolean indicating the success of the removal or an error message.
     * @throws {Error} - Throws an error if there is an issue with the removal process.
     *
     * @description
     * This static method leverages the CodingTagService to remove all coding tags associated with a specific user.
     * It handles the removal operation asynchronously and returns a Promise that resolves to either a boolean indicating
     * the success of the removal or an error message if there is an issue with the removal process.
     *
     * @example
     * // Example: Remove all coding tags associated with a specific user
     * const userIdToRemoveTags = 456;
     * try {
     *   const isRemoved = await CodingTag.removeAllUserTags(userIdToRemoveTags);
     *   console.log('User tags removal successful:', isRemoved);
     * } catch (error) {
     *   console.error('Failed to remove user tags:', error.message);
     * }
     */
    public static async removeAllUserTags(userId: number): Promise<boolean | string> {
        try {
            // Calling the removeAllUserTags method from the service.
            return await CodingTagService.removeAllUserTags(userId);
        } catch (error) {
            // Handling any errors that occur during the process.
            return `Error removing user tags: ${error}`;
        }
    }
}
