import {session} from "@hboictcloud/api";
import {User} from "../models/user";
import {sign} from "./jsonwebtoken";


/**
 * Removes JWTToken from session upon
 *
 * @returns {Promise<void>} A Promise that resolves after the specified delay.
 */
export async function endUserSession(): Promise<void> {
    // Remove JWTToken From session
    session.remove("JWTToken");
    location.reload();
}


/**
 * Assigns a JWT token to the user's session after logging in.
 *
 * @param {User} user - The logged-in user data or user ID.
 * @returns {Promise<void>} A Promise that resolves when the token is assigned successfully.
 */
export async function assignToken(user: User): Promise<void> {
    // Get secret key from env file
    const secret: string = __SECRET_KEY__;

    // Construct payload for JWT
    const payload: { userId: number; email: string } = {
        userId: user.userId,
        email: user.email,
    };

    console.log(payload);

    // Generate JWT with payload and secret.
    const jwtToken: string = (await sign(payload, secret)).valueOf();

    // Put JWT inside user session storage
    session.set("JWTToken", jwtToken);
}