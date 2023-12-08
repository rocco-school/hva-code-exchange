import bcrypt from "bcryptjs";

/**
 * Hashes the user's password
 * @param password - The user's password to be hashed.
 * @returns {Promise<string | null>} A Promise that resolves to the hashed password or null.
 */
export async function hashPassword(password: string): Promise<string | null> {
    try {
        // Generates a random salt (unique text) to add to the hash.
        const salt: string = await bcrypt.genSalt(10);

        // Hashes the password.
        return await bcrypt.hash(password, salt);
    } catch (error: unknown) {
        // Handle bcrypt error.
        console.error("Error hashing the password:", error);
        return null;
    }
}

/**
 * Compares a plain text password with a hashed password.
 * @param {string} plainPassword - The plain text password to compare.
 * @param {string} hashedPassword - The hashed password to compare against.
 * @returns {Promise<boolean>} A Promise that resolves to true if the passwords match, otherwise resolves to false.
 */
export async function comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    try {
        // Use bcrypt to compare the plain text password with the hashed password.
        return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
        // Handle errors during password comparison.
        console.error("Error comparing passwords:", error);
        throw error;
    }
}