import {User} from "../models/user";
import {USER_QUERY} from "../query/user.query";
import {api} from "@hboictcloud/api";

/**
 * Retrieves a user from the database by user ID.
 * @param {number} userId - The ID of the user to retrieve.
 * @returns {Promise<User>} A Promise that resolves to the user object if found, otherwise resolves to undefined.
 */
export async function getUserById(userId: number): Promise<User | undefined> {
    try {
        // Use the API to query the database and retrieve user information.
        const userArray: [User] = await api.queryDatabase(USER_QUERY.SELECT_USER, userId) as [User];

        // If the user is not found, the function resolves to undefined.
        if (userArray.length <= 0) return undefined;

        // Return the first user from the array
        return userArray[0] as User;
    } catch (error) {
        // Log any errors that occur during the database query.
        console.error(`Error while retrieving user with ID ${userId}:`, error);
        // Propagate the error so the caller can handle it if needed.
        throw error;
    }
}