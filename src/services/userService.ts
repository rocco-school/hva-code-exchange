import {api} from "@hboictcloud/api";
import {User} from "../models/user";
import {USER_QUERY} from "../query/user.query";
import {QUESTION_QUERY} from "../query/question.query";

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
        return getUser[0];
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
        // Destructuring the user object to get individual properties
        const userData: (string | number | boolean | null)[] = [user.firstname, user.lastname, user.username, user.password, user.email, user.userId];

        // Querying the database to update the user with the given userId.
        const updatedUser: [User] = await api.queryDatabase(USER_QUERY.UPDATE_USER, ...userData) as [User];

        // Checking if the database update was successful.
        if (!updatedUser) {
            throw new Error(`Failed to update user with ID: ${user.userId}`);
        }

        return updatedUser[0];
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

        return getUser[0];
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