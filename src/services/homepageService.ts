// Importing the User model, api module, and user query from respective paths
import { User } from "../models/user";
import { api } from "@hboictcloud/api";
import { USER_QUERY } from "../query/user.query";

// Defining a class named homepageService
export class homepageService {

    // A static method for searching a user by their ID
    public static async searchUserId(userId: number): Promise<User> {
        // Using the api module to query the database using the USER_QUERY.SELECT_USER query and the provided userId
        const userData: [User] = await api.queryDatabase(USER_QUERY.SELECT_USER, userId) as [User];

        // Checking if userData is falsy, indicating that the user doesn't exist
        if (!userData) {
            console.log("user doesn't exist");
        }

        // Returning the first element of the userData array (if it exists)
        return userData[0];
    }
}
