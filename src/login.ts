import {delay} from "./components/delay";
import "./config";
import {api, session, url} from "@hboictcloud/api";
import {User} from "./models/user";
import {USER_QUERY} from "./query/user.query";
import {comparePasswords} from "./components/hashPassword";
import {security} from "./components/security";
import {JWTPayload} from "jose";
import {assignToken} from "./components/handleUserSession";

/**
 * The main application entry point for the login page.
 *
 * This function initializes the login page, including event handling,
 * user verification, and other related functionality.
 *
 * @returns {Promise<void>} A Promise that resolves when the application setup is complete.
 */
async function setup(): Promise<void> {

    // Check the security status by calling the 'security' function.
    const loginStatus: JWTPayload | boolean = await security();

    // If the user is authenticated (loginStatus is true), redirect them to the index.html page.
    if (loginStatus) {
        url.redirect("/index.html");
    }

    // Create an action for the login button. When you press this, the code between the { } is called
    document.querySelector(".login-btn")?.addEventListener("click", async () => {
        // Get the values from the input fields with the id username and email
        const email: string = (<HTMLInputElement>document.getElementById("email")).value;
        const password: string = (<HTMLInputElement>document.getElementById("password")).value;

        // Call the loginFromDatabase function (on line 50) and provide username and email
        try {
            const data: any = await loginFromDatabase(email, password);

            if (data) {
                // Redirect the user to the home page
                // url.redirect("/questions.html");
            } else {
                // If the user does not exist, give notification to user by setting display to block in the css (bootstrap)
                document.getElementsByClassName("alert-danger")[0].setAttribute("style", "display: block");
                await delay(3000);
                document.getElementsByClassName("alert-danger")[0].setAttribute("style", "display: none");

                // Empty the input fields again
                (<HTMLInputElement>document.getElementById("username")).value = "";
                (<HTMLInputElement>document.getElementById("password")).value = "";
            }
        } catch (error) {
            // if it fails to retrieve the data, give the user an error message
            console.log("Fout bij inloggen");
        }
    });
}

/**
 * Logs in a user by verifying the email and password against the database.
 * @param {string} email - The email address of the user.
 * @param {string} password - The user's password.
 * @returns {Promise<User | []>} A Promise that resolves to the user object if login is successful, otherwise resolves to an empty array.
 */
async function loginFromDatabase(email: string, password: string): Promise<User | []> {
    try {
        console.log("Start");
        // Query the database to retrieve user information based on the email.
        const user: [User] = await api.queryDatabase(USER_QUERY.FIND_USER_BY_EMAIL, email) as [User];

        // Check if a user with the given email exists.
        if (user.length <= 0) {
            // If no user is found, return an empty array.
            console.error("User not found for the provided email.");
            return [];
        }

        // Compare the provided password with the hashed password from the database.
        const checkPassword: boolean = await comparePasswords(password, user[0].password);

        // If the passwords do not match, return an empty array.
        if (!checkPassword) {
            console.error("Password does not match.");
            return [];
        }

        // Clear session from previous sessions.
        session.clear();

        // If the password is correct, assign a JWT to the user.
        await assignToken(user[0]);

        location.reload();

        // Return the user object if login is successful.
        return user[0];
    } catch (error) {
        // Handle unexpected errors during login.
        console.error("Unexpected error during login:", error);
        return [];
    }
}

// Invoke the login page application entry point.
await setup();
