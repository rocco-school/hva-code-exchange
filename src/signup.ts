import "./config";
import {api, url} from "@hboictcloud/api";
import {USER_QUERY} from "./query/user.query";
import {hashPassword} from "./components/hashPassword";
import {User} from "./models/user";
import {JWTPayload} from "jose";
import {security} from "./components/security";

/**
 * The main application entry point for the signup page.
 *
 * This function initializes the signup page, including event handling,
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

    // keeps redirect message hidden
    document.getElementsByTagName("section")[0].setAttribute("style", "display:none");

    const firstnameInput: HTMLInputElement = (<HTMLInputElement>document.getElementById("firstname"));
    const lastnameInput: HTMLInputElement = (<HTMLInputElement>document.getElementById("lastname"));
    const usernameInput: HTMLInputElement = (<HTMLInputElement>document.getElementById("username"));
    const emailInput: HTMLInputElement = (<HTMLInputElement>document.getElementById("email"));
    const passwordInput: HTMLInputElement = (<HTMLInputElement>document.getElementById("password"));
    const submitButton: HTMLInputElement = (<HTMLInputElement>document.getElementById("signupForm"));

    // Regular Expression for email
    // Needs alphanumerics before the @ which follows with a dot and 2-4 letters
    const emailRegEx: RegExp = /^((?![\w-\.]+@([\w-]+\.)+[\w-]{2,4}).)*$/;

    // Regular Expression for password
    // Minimum ofeight and maximum 60 characters, at least one uppercase letter, one lowercase letter, one number and one special character
    const passwordRegEx: RegExp = /^((?!(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,60}$).)*$/;

    // Regular Expression for firstname and lastname
    // only letters are allowed and numbers are not allowed
    const nameRegEx: RegExp = /^[a-zA-Z\s]+$/;

    if (submitButton) {
        submitButton.addEventListener("submit", async function (e: any): Promise<void> {
            e.preventDefault();

            // Hide any previous error messages.
            document.getElementsByClassName("alert-danger")[0].setAttribute("style", "display: none");

            // Array of input elements for validation.
            const inputs: (HTMLInputElement | null)[] = [firstnameInput, lastnameInput, usernameInput, emailInput, passwordInput];

            // Validate the user inputs.
            const verifiedInputs: boolean = await validateInputs(inputs);

            if (verifiedInputs) {
                // Verify individual input fields.
                const verifiedFirstname: boolean = await verifyFirstname(firstnameInput.value);
                if (!verifiedFirstname) return;

                const verifiedLastname: boolean = await verifyLastname(lastnameInput.value);
                if (!verifiedLastname) return;

                const verifiedEmail: boolean = await verifyEmail(emailInput.value);
                if (!verifiedEmail) return;

                const verifiedPass: boolean = await verifyPassword(passwordInput.value);
                if (!verifiedPass) return;

                // If all inputs are verified, attempt user sign-up.
                if (verifiedFirstname && verifiedLastname && verifiedPass && verifiedEmail) {
                    try {
                        // Call the sign-up function and await the result.
                        const newUser: any = await signUpDatabase(
                            firstnameInput.value,
                            lastnameInput.value,
                            usernameInput.value,
                            emailInput.value,
                            passwordInput.value
                        );

                        // Check if the sign-up was successful.
                        if (newUser instanceof Error) {
                            // Handle error case.
                            console.error("Error during user sign-up:", newUser.message);
                        } else {
                            // Log the newly created user.
                            console.log("User signed up successfully:", newUser);


                            // TODO:add popup to tell user successfully signed up
                            // location.replace("login.html");
                        }
                    } catch (e) {
                        // Handle unexpected errors during sign-up.
                        console.error("Unexpected error during user sign-up:", e);
                    }
                }
            }
        });
    }


    /**
     * Validates the input field and sets a custom validation message if needed.
     * @param {HTMLInputElement | null} inputs - The input element to validate.
     */
    async function validateInputs(inputs: any): Promise<boolean> {
        let noError: boolean = true;
        for (const input of inputs) {
            if (input && input.value === "") {
                const textInput: string = input.name + " is required!";
                // Returns the alertPopUp function and with the assigned data
                await alertPopUp(textInput);
                noError = false;
                break;
            }
        }

        return noError;
    }

    /**
     * Validates the email field and sets a custom validation message if needed.
     *
     * @param email
     */
    async function verifyEmail(email: any): Promise<boolean | any> {
        if (email.match(emailRegEx)) {
            const textInput: string = "Email is not correct!";
            // Returns the alertPopUp function and with the assigned data
            await alertPopUp(textInput);
            return false;
        }
        try {
            const emailExists: any = await api.queryDatabase(USER_QUERY.GET_EMAIL_BY_EMAIL, email);
            console.log(emailExists);
            if (emailExists[0]) {
                const textInput: string = "Email already exists!";
                // Returns the alertPopUp function and with the assigned data
                await alertPopUp(textInput);
            }


            return !emailExists[0];

        } catch (e) {
            console.log(e);
        }

    }

    /**
     * Validates the firstname field and sets a custom validation message if needed.
     *
     * @param firstname
     */
    async function verifyFirstname(firstname: any): Promise<boolean> {
        if (!firstname.match(nameRegEx)) {
            // Returns the alertPopUp function and with the assigned data
            const textInput: string = "Your firstname may only contain letters";
            await alertPopUp(textInput);
            return false;
        }

        return true;
    }

    /**
     * Validates the lastname field and sets a custom validation message if needed.
     *
     * @param lastname
     */
    async function verifyLastname(lastname: any): Promise<boolean> {
        if (!lastname.match(nameRegEx)) {
            const textInput: string = "Your lastname may only contain letters";
            // Returns the alertPopUp function and with the assigned data
            await alertPopUp(textInput);
            return false;
        }
        return true;
    }

    /**
     * Validates the password field and sets a custom validation message if needed.
     *
     * @param password
     */
    async function verifyPassword(password: any): Promise<boolean> {
        if (password.match(passwordRegEx)) {
            const textInput: string = "Your password needs a minimum of eight characters, at least one uppercase letter, one lowercase letter, one number and one special character.";
            // Returns the alertPopUp function and with the assigned data
            await alertPopUp(textInput);
            return false;
        }
        return true;
    }
}


/**
 * Signs up a new user by inserting user data into the database.
 * @param {string} firstnameInput - The first name of the user.
 * @param {string} lastnameInput - The last name of the user.
 * @param {string} usernameInput - The username chosen by the user.
 * @param {string} emailInput - The email address of the user.
 * @param {string} passwordInput - The user's password.
 * @returns {Promise<User>} A Promise that resolves to the user object if the sign-up is successful, otherwise resolves to an error.
 */
async function signUpDatabase(firstnameInput: string, lastnameInput: string, usernameInput: string, emailInput: string, passwordInput: string): Promise<User | Error> {
    try {
        // Hash the user's password.
        const password: string | null = await hashPassword(passwordInput);

        // If hashing the password fails, return early.
        if (!password) {
            return new Error("Error hashing the password.");
        }

        // Prepare data for database insertion.
        const dataString: any = [firstnameInput, lastnameInput, usernameInput, password, emailInput];

        // Insert user data into the database.
        const user: Promise<any> = api.queryDatabase(USER_QUERY.CREATE_USER, ...dataString);
        // Retrieve the newly created user based on the insertId.
        return user
            .then((databaseResponse) => {
                const insertId: number = databaseResponse.insertId;
                return User.retrieveUser(insertId);
            })
            .catch((error: Error) => {
                console.error("Error inserting user:", error);
                throw error; // Propagate the error for external handling.
            }) as User;
    } catch (error) {
        // If an unexpected error occurs, return an error object.
        console.error("Unexpected error during user sign-up:", error);
        return new Error("Unexpected error during user sign-up.");
    }
}

/**
 *
 * @param textInput
 */
async function alertPopUp(textInput: string): Promise<void> {
    document.getElementsByClassName("alert-danger")[0].setAttribute("style", "display: block");
    document.getElementsByClassName("alert-danger")[0].innerHTML = textInput;
}

// Calls the setup function when the page is loaded
await setup();