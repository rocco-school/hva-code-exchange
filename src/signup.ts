import "./config";
import { api } from "@hboictcloud/api";
import { USER_QUERY } from "./query/user.query";

/**
 * This method will be called when the page is loaded.
 */
function setup(): void {
    // Keeps redirect message hidden initially
    document.getElementsByTagName("section")[0].setAttribute("style", "display:none");

    // Retrieving input elements by ID
    const firstnameInput: HTMLInputElement | null = document.getElementById("firstname") as HTMLInputElement;
    const lastnameInput: HTMLInputElement | null = document.getElementById("lastname") as HTMLInputElement;
    const usernameInput: HTMLInputElement | null = document.getElementById("username") as HTMLInputElement;
    const emailInput: HTMLInputElement | null = document.getElementById("email") as HTMLInputElement;
    const passwordInput: HTMLInputElement | null = document.getElementById("password") as HTMLInputElement;

    const submitButton: HTMLInputElement | null = document.getElementById("signupForm") as HTMLInputElement;

    // Regular Expressions for validation
    const emailRegEx: RegExp = /^((?![\w-\.]+@([\w-]+\.)+[\w-]{2,4}).)*$/;
    const passwordRegEx: RegExp = /^((?!(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,60}$).)*$/;
    const nameRegEx: RegExp = /^[a-zA-Z\s]+$/;

    if (submitButton) {
        submitButton.addEventListener("submit", async function (e: any): Promise<void> {
            e.preventDefault();

            // Hide previous error messages
            document.getElementsByClassName("alert-danger")[0].setAttribute("style", "display: none");

            const inputs: (HTMLInputElement | null)[] = [firstnameInput, lastnameInput, usernameInput, emailInput, passwordInput];

            const verifiedInputs: boolean = await validateInputs(inputs);

            console.log(verifiedInputs);

            if (verifiedInputs) {
                const verifiedFirstname: boolean = await verifyFirstname(firstnameInput.value);
                console.log(verifiedFirstname, "firstname");
                // If firstname validation fails, return early
                if (!verifiedFirstname) return;

                const verifiedLastname: boolean = await verifyLastname(lastnameInput.value);
                console.log(verifiedLastname, "lastname");
                // If lastname validation fails, return early
                if (!verifiedLastname) return;

                const verifiedEmail: boolean = await verifyEmail(emailInput.value);
                console.log(verifiedEmail, "email");
                // If email validation fails, return early
                if (!verifiedEmail) return;

                const verifiedPass: boolean = await verifyPassword(passwordInput.value);
                console.log(verifiedPass, "password");
                // If password validation fails, return early
                if (!verifiedPass) return;

                // If all validations pass, proceed with signup
                if (verifiedInputs && verifiedFirstname && verifiedLastname && verifiedPass && verifiedEmail) {
                    try {
                        const newUser: any = await signUpDatabase(
                            firstnameInput.value,
                            lastnameInput.value,
                            usernameInput.value,
                            emailInput.value,
                            passwordInput.value
                        );

                        if (newUser) {
                            console.log(newUser);
                        }
                    } catch (e) {
                        console.log(e);
                    }
                }
            }
        });
    }

    /**
     * Validates the input fields and sets a custom validation message if needed.
     * @param {HTMLInputElement | null} inputs - The input elements to validate.
     */
    async function validateInputs(inputs: any): Promise<boolean> {
        let noError: boolean = true;
        for (const input of inputs) {
            if (input && input.value === "") {
                // Display an error message if an input is empty
                const textInput: string = `${input.name} is required!`;
                await alertPopUp(textInput);
                noError = false;
                break;
            }
        }

        return noError;
    }

    /**
     * Validates the email field and sets a custom validation message if needed.
     * @param email
     */
    async function verifyEmail(email: any): Promise<boolean | any> {
        console.log(email, "1");
        if (email.match(emailRegEx)) {
            // Display an error message if the email format is incorrect
            const textInput: string = "Email is not correct!";
            await alertPopUp(textInput);
            return false;
        }
        console.log(email, "2");
        try {
            const emailExists: any = await api.queryDatabase(USER_QUERY.GET_EMAIL_BY_EMAIL, email);
            console.log(emailExists);
            if (emailExists[0]) {
                // Display an error message if the email already exists in the database
                const textInput: string = "Email already exists!";
                await alertPopUp(textInput);
            }

            return !emailExists[0];

        } catch (e) {
            console.log(e);
        }
    }

    /**
     * Validates the firstname field and sets a custom validation message if needed.
     * @param firstname
     */
    async function verifyFirstname(firstname: any): Promise<boolean> {
        if (!firstname.match(nameRegEx)) {
            // Display an error message if the firstname contains invalid characters
            const textInput: string = "Your firstname may only contain letters";
            await alertPopUp(textInput);
            return false;
        }

        return true;
    }

    /**
     * Validates the lastname field and sets a custom validation message if needed.
     * @param lastname
     */
    async function verifyLastname(lastname: any): Promise<boolean> {
        if (!lastname.match(nameRegEx)) {
            // Display an error message if the lastname contains invalid characters
            const textInput: string = "Your lastname may only contain letters";
            await alertPopUp(textInput);
            return false;
        }
        return true;
    }

    /**
     * Validates the password field and sets a custom validation message if needed.
     * @param password
     */
    async function verifyPassword(password: any): Promise<boolean> {
        console.log(password);
        if (password.match(passwordRegEx)) {
            // Display an error message if the password does not meet the criteria
            const textInput: string = "Your password needs a minimum of eight characters, at least one uppercase letter, one lowercase letter, one number, and one special character.";
            await alertPopUp(textInput);
            return false;
        }
        return true;
    }
}

/**
 * Signs up the user in the database.
 * @param firstnameInput
 * @param lastnameInput
 * @param usernameInput
 * @param emailInput
 * @param passwordInput
 * @returns Array with the user data
 */
async function signUpDatabase(firstnameInput: string, lastnameInput: string, usernameInput: string, emailInput: string, passwordInput: string): Promise<any[] | string[]> {
    // Tries to get the data out of the database
    try {
        const dataString: string[] = [firstnameInput, lastnameInput, usernameInput, passwordInput, emailInput];
        const data: any = await api.queryDatabase(USER_QUERY.CREATE_USER, ...dataString);
        return data;
    } catch (error) {
        // If it fails, then it returns an empty array
        return [];
    }
}

/**
 * Displays a pop-up alert message.
 * @param textInput
 */
async function alertPopUp(textInput: string): Promise<void> {
    // Displays an error message pop-up
    document.getElementsByClassName("alert-danger")[0].setAttribute("style", "display: block");
    document.getElementsByClassName("alert-danger")[0].innerHTML = textInput;
}

// Calls the setup function when the page is loaded
setup();
