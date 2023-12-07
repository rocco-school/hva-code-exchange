import "./config";
import {api} from "@hboictcloud/api";
import {USER_QUERY} from "./query/user.query";


/**
 * This method will be called when the page is loaded, this happens at the end of this file.
 */
function setup(): void {
    // keeps redirect message hidden
    document.getElementsByTagName("section")[0].setAttribute("style", "display:none");

    const firstnameInput: any = (document.getElementById("firstname") as HTMLInputElement);
    const lastnameInput: any = (document.getElementById("lastname") as HTMLInputElement);
    const usernameInput: any = (document.getElementById("username") as HTMLInputElement);
    const emailInput: any = (document.getElementById("email") as HTMLInputElement);
    const passwordInput: any = (document.getElementById("password") as HTMLInputElement);

    const submitButton: any = (document.getElementById("signupForm") as HTMLInputElement);

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

            document.getElementsByClassName("alert-danger")[0].setAttribute("style", "display: none");

            const inputs: (HTMLInputElement | null)[] = [firstnameInput, lastnameInput, usernameInput, emailInput, passwordInput];

            const verifiedInputs: boolean = await validateInputs(inputs);

            console.log(verifiedInputs);

            if (verifiedInputs) {
                const verifiedFirstname: boolean = await verifyFirstname(firstnameInput.value);
                console.log(verifiedFirstname, "fistname");
                if (!verifiedFirstname) return;
                const verifiedLastname: boolean = await verifyLastname(lastnameInput.value);
                console.log(verifiedLastname, "lastname");
                if (!verifiedLastname) return;
                const verifiedEmail: boolean = await verifyEmail(emailInput.value);
                console.log(verifiedEmail, "Email");
                if (!verifiedEmail) return;
                const verifiedPass: boolean = await verifyPassword(passwordInput.value);
                console.log(verifiedPass, "password");
                if (!verifiedPass) return;

                if (verifiedInputs && verifiedFirstname && verifiedLastname && verifiedPass && verifiedEmail) {
                    try {
                        const newUser: any = await signUpDatabase(firstnameInput.value, lastnameInput.value, usernameInput.value, emailInput.value, passwordInput.value);

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
        console.log(email, "1");
        if (email.match(emailRegEx)) {
            const textInput: string = "Email is not correct!";
            // Returns the alertPopUp function and with the assigned data
            await alertPopUp(textInput);
            return false;
        }
        console.log(email, "2");
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
        console.log(password);
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
 *
 * @param firstname
 * @param lastname
 * @param username
 * @param email
 * @param password
 * @returns Array with the user data
 */
async function signUpDatabase(firstnameInput: string, lastnameInput: string, usernameInput: string, emailInput: string, passwordInput: string): Promise<any[] | string[]> {

    // tries to get the data out of the database
    try {
        const dataString: string[] = [firstnameInput, lastnameInput, usernameInput, passwordInput, emailInput];
        const data: any = await api.queryDatabase(USER_QUERY.CREATE_USER, ...dataString);
        return data;
    } catch (error) {
        // if it fails, then it returns an empty array
        return [];
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
setup();