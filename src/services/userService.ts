import {api} from "@hboictcloud/api";
import {User} from "../models/user";
import {USER_QUERY} from "../query/user.query";
import {CodingTag} from "../models/codingTag";

/**
 * A service class for handling operations related to users in the database.
 *
 * @class
 */
export class UserService {
    /**
     * Save a user to the database.
     *
     * @param {User} user - The user object to be saved.
     * @returns {Promise<User>} A Promise resolving to the saved user.
     * @throws {Error} Throws an error if the database query was not successful.
     *
     * @description
     * This static method saves a new user to the database using the provided user object.
     * If the userId is null, it indicates a new user, and the database will auto-increment the ID.
     * It queries the database to create a new user and returns a Promise that resolves to the saved user.
     */
    public static async saveUser(user: User): Promise<User> {
        // Querying the database with the new user data.
        const param: (string | number | boolean | null)[] = [user.firstname, user.lastname, user.username, user.password, user.email];
        const newUser: any = await api.queryDatabase(USER_QUERY.CREATE_USER, ...param);

        // Retrieving the newly created user from the database.
        const getUser: [User] = await api.queryDatabase(USER_QUERY.SELECT_USER, newUser.insertId) as [User];

        // Checking if the database query was successful.
        if (!getUser) {
            // If the query was not successful, throw an error.
            throw new Error("Failed to create user in the database");
        }

        // Hiding the createUserForm and refreshing the page.
        return getUser[0] as User;
    }

    /**
     * Update a user in the database.
     *
     * @param {User} user - The user object containing the updated data.
     * @returns {Promise<User>} A Promise resolving to the updated user.
     * @throws {Error} Throws an error if the database update was not successful.
     *
     * @description
     * This static method updates a user in the database using the provided user object.
     * It destructures the user object to extract individual properties and then queries the database
     * to perform the update. The method returns a Promise that resolves to the updated user.
     */
    public static async updateUser(user: User): Promise<User> {
        try {
            // Update the user in the User table.
            const userData: (string | number | boolean | null)[] = [user.firstname, user.lastname, user.username, user.password, user.email, user.userId];
            await api.queryDatabase(USER_QUERY.UPDATE_USER, ...userData);

            // Retrieve the updated user from the database.
            const getUser: [User] = await api.queryDatabase(USER_QUERY.SELECT_USER, user.userId) as [User];

            // Checking if the database retrieval was successful.
            if (!getUser) {
                new Error(`Failed to get User: ${user.userId}!`);
            }

            // Return the updated user.
            return getUser[0] as User;
        } catch (error) {
            // Handle any errors that occur during the update or retrieval process.
            throw new Error(`Failed to update User: ${user.userId}: ${error}`);
        }
    }

    /**
     * Retrieve a user from the database.
     *
     * @param {number} userId - The ID of the user to be retrieved.
     * @returns {Promise<[User]>} A Promise resolving to the retrieved user.
     * @throws {Error} Throws an error if the database retrieval was not successful.
     *
     * @description
     * This static method retrieves a specific user from the database based on its ID.
     * It queries the database to retrieve the user with the given userId and returns
     * a Promise that resolves to the retrieved user.
     */
    public static async retrieveUser(userId: number): Promise<User> {
        // Querying the database to retrieve the user with the given userId.
        const getUser: [User] = await api.queryDatabase(USER_QUERY.SELECT_USER, userId) as [User];

        // Checking if the database retrieval was successful.
        if (!getUser) {
            throw new Error(`Failed to retrieve answer with ID: ${userId}`);
        }

        return getUser[0] as User;
    }

    /**
     * Delete a user in the database.
     *
     * @param {number} userId - The ID of the user to be deleted.
     * @returns {Promise<boolean>} A Promise resolving to the deletion status.
     * @throws {Error} Throws an error if the database deletion was not successful.
     *
     * @description
     * This static method deletes a specific user from the database based on its ID.
     * It queries the database to delete the user with the given user and returns
     * a Promise that resolves to a boolean indicating whether the deletion was successful.
     */
    public static async deleteUser(userId: number): Promise<boolean> {
        // Querying the database to delete the user with the given userId.
        const deleteUser: any = await api.queryDatabase(USER_QUERY.DELETE_USER, userId) as any;

        // Checking if the database deletion was successful.
        if (deleteUser.affectedRows === 0) {
            return false; // No rows affected, indicating the user was not found.
        }

        if (deleteUser.affectedRows > 0) {
            return true; // Deletion successful.
        }

        // If affectedRows is not 0 or greater than 0, something unexpected happened.
        throw new Error(`Failed to delete user with ID: ${userId}`);
    }


    /**
     * Retrieves the expertises of a user from the database.
     *
     * @param {number} userId - The ID of the user to retrieve expertises for.
     * @returns {Promise<[CodingTag]>} A Promise resolving to an array of CodingTag representing the user's expertises.
     * @throws {Error} Throws an error if the database retrieval was not successful.
     *
     * @description
     * This static method queries the database to retrieve the expertises of a specific user based on their ID.
     * It returns a Promise that resolves to an array of CodingTag representing the user's expertises.
     * If the database retrieval is not successful, an error is thrown.
     */
    public static async getUserExpertises(userId: number): Promise<[CodingTag]> {
        // Querying the database to retrieve all user expertises with the given userId.
        const codingTags: [CodingTag] = await api.queryDatabase(USER_QUERY.GET_USER_EXPERTISE, userId) as [CodingTag];

        // Checking if the database retrieval was successful.
        if (!codingTags) {
            throw new Error(`Failed to retrieve codingTags from Database with userId: ${userId}!`);
        }

        return codingTags as [CodingTag];
    }


    /**
     * Retrieves user tags for a given user ID from the database using the specified query.
     *
     * @param {number} userId - The ID of the user to retrieve tags for.
     * @returns {Promise<any[]>} A Promise resolving to an array of user tags.
     * @throws {Error} Throws an error if the database retrieval was not successful.
     *
     * @description
     * This static method queries the database to retrieve user tags for a specific user based on the provided user ID.
     * It returns a Promise that resolves to an array of user tags, and it throws an error if the database retrieval fails.
     */
    public static async retrieveUserTags(userId: number): Promise<any[]> {
        // Querying the database to retrieve user tags for the specified user.
        const userTags: any = await api.queryDatabase(USER_QUERY.SELECT_TAGS_BY_USER, userId);

        // Checking if the database retrieval was successful.
        if (!userTags) {
            throw new Error(`Failed to retrieve user tags for user with ID: ${userId} from the database!`);
        }

        return userTags;
    }

    /**
     * Inserts tags for a given user into the database.
     *
     * @param {number} userId - The ID of the user to associate with the tags.
     * @param {number[]} tagIds - An array of tag IDs to associate with the user.
     * @returns {Promise<boolean>} A Promise resolving to true upon successful insertion.
     * @throws {Error} Throws an error if the database insertion was not successful.
     *
     * @description
     * This static method inserts tags for a specific user into the database.
     * It iterates through the array of tag IDs and queries the database to create associations between
     * the user and each tag. It returns a Promise that resolves to true upon successful insertion.
     */
    public static async insertUserTag(userId: number, tagIds: number[]): Promise<boolean> {
        for (const tagId of tagIds) {
            const userTagData: [number, number] = [userId, tagId];

            // Query the database to insert the user-tag association.
            const createdUserTag: any = await api.queryDatabase(
                USER_QUERY.CREATE_USER_TAG,
                ...userTagData
            ) as any;

            // Check if the database insertion was successful.
            if (!createdUserTag) {
                throw new Error(`Failed to insert user tags for user with ID: ${userId}`);
            }
        }
        return true;
    }
}