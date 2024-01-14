import {session} from "@hboictcloud/api";
import {verify} from "./jsonwebtoken";
import {JWTPayload} from "jose";

/**
 * Checks the security status of the user session.
 * If the session with the name "user" does not exist or is undefined,
 * returns false; otherwise, returns true.
 * @returns {Promise<boolean>} A Promise that resolves to true if the user is authenticated, otherwise resolves to false.
 */
export async function security(): Promise<JWTPayload | boolean> {
    try {
        // Get the JWT token from the user's session.
        const token: string | undefined = session.get("JWTToken");

        // If the token is not present or is undefined, the user is not authenticated.
        if (!token) {
            console.log("User not logged in.");
            return false;
        }

        // Verify the JWT token using the secret key.
        const logged: JWTPayload | null = await verify(token, __SECRET_KEY__);

        // If the token is invalid or expired, the user is not authenticated.
        if (!logged) {
            console.log("Invalid or expired token.");
            return false;
        }

        // If the token is valid, the user is authenticated.
        return logged;
    } catch (error) {
        // Handle unexpected errors.
        console.error("Unexpected error during security check:", error);
        return false;
    }
}