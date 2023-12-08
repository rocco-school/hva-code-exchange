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
    const loginStatus: JWTPayload = await security();

    // If the user is authenticated (loginStatus is true), redirect them to the index.html page.
    if (loginStatus) {
        url.redirect("/index.html");
    }

    // Maak een actie aan voor de login knop. Als je hier op drukt wordt de code tussen de { } aangeroepen
    document.querySelector(".login-btn")?.addEventListener("click", async () => {
        // Haal de waarden uit de inputvelden met het id username en email
        const email: string = (<HTMLInputElement>document.getElementById("email")).value;
        const password: string = (<HTMLInputElement>document.getElementById("password")).value;

        // Roep de loginFromDatabase functie aan (op regel 50) en geef username en email mee
        try {
            const data: any = await loginFromDatabase(email, password);

            if (data) {
                // Stuur de gebruiker door naar de homepagina
                // url.redirect("/question.html");
            } else {
                // Als de gebruiker niet bestaat, geef melding aan gebruiker door in de css (bootstrap) de display op block te zetten
                document.getElementsByClassName("alert-danger")[0].setAttribute("style", "display: block");
                await delay(3000);
                document.getElementsByClassName("alert-danger")[0].setAttribute("style", "display: none");

                // Maak de inputvelden weer leeg
                (<HTMLInputElement>document.getElementById("username")).value = "";
                (<HTMLInputElement>document.getElementById("password")).value = "";
            }
        } catch (error) {
            // als het niet lukt de data op te halen, geef de gebruiker een foutmelding
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