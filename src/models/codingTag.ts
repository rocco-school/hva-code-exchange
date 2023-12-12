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
     * @returns {Promise<Question[] | string>} A Promise resolving to either the saved codingTag or an error message.
     * @throws {Error} Throws an error if the save operation fails.
     */
    public async saveCodingTag(): Promise<CodingTag[] | string> {
        try {
            // Calling the saveQuestion method from the service
            return await CodingTagService.saveCodingTag(this);
        } catch (error) {
            // Handling any errors that occur during the process
            return `Error saving Coding tag: ${error}`;
        }
    }

    /**
     * Updates the Coding Tag in the database using the service.
     *
     * @returns {Promise<Question[] | string>} A Promise resolving to either the updated Coding Tag or an error message.
     * @throws {Error} Throws an error if the update operation fails.
     */
    public async updateQuestion(): Promise<CodingTag[] | string> {
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
     * @returns {Promise<CodingTag[] | string>} A Promise resolving to either the retrieved coding tag or an error message.
     * @throws {Error} Throws an error if the retrieval operation fails.
     */
    public static async retrieveCodingTag(tagId: number): Promise<CodingTag[] | string> {
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
     * @returns {Promise<CodingTag[] | string>} A Promise resolving to either delete the coding tag or an error message.
     * @throws {Error} Throws an error if the deletion operation fails.
     */
    public static async deleteCodingTag(tagId: number): Promise<CodingTag[] | string> {
        try {
            // Calling the deleteQuestion method from the service.
            return await CodingTagService.deleteCodingTag(tagId);
        } catch (error) {
            // Handling any errors that occur during the process.
            return `Error deleting coding tag: ${error}`;
        }
    }

}
