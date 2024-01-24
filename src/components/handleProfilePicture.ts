import {User} from "../models/user";
import {api} from "@hboictcloud/api";

/**
 * Get the profile picture path for a user.
 *
 * @param {User} user - The user object containing user information.
 * @returns {Promise<string>} The profile picture URL.
 */
export async function getProfilePicturePath(user: User): Promise<string> {
    // Default picture URL
    const defaultPicture: string = "https://ui-avatars.com/api/?name=" + user.firstname + "+" + user.lastname + "?background=random";

    try {
        if (user.profilePicture) {
            // Extract filename from the profilePicture URL
            const getFileName: string[] = user.profilePicture.split("https://quumuuteexaa68-pb2b2324.hbo-ict.cloud/uploads/");
            const filename: string = getFileName[1];

            // Check if the file exists
            const fileExists: boolean = await api.fileExists(filename) as boolean;

            // Return the appropriate profile picture URL
            return fileExists ? user.profilePicture : defaultPicture;
        } else {
            // If there's no profile picture, return the default picture URL
            return defaultPicture;
        }
    } catch (error) {
        // Handle any errors that occur during the process
        console.error("Error fetching profile picture:", error);
        return defaultPicture; // Return default picture URL on error
    }
}