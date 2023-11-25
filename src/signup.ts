import { delay } from "./components/delay";
import "./config";
import { api, url } from "@hboictcloud/api";

// Haal de waarden uit de inputvelden met het id username, email and password
const firstnameInput: any = (document.getElementById("firstname") as HTMLInputElement);
const lastnameInput: any = (document.getElementById("lastname") as HTMLInputElement);
const usernameInput: any = (document.getElementById("username") as HTMLInputElement);
const emailInput: any = (document.getElementById("email") as HTMLInputElement);
const passwordInput: any = (document.getElementById("password") as HTMLInputElement);

// Gets an array with emails from the database
const emailData: any = await api.queryDatabase(
    "SELECT email FROM user"
);

// keeps redirect message hidden
document.getElementsByTagName("section")[0].setAttribute("style", "display:none");

// Regular Expression for names
// only letters are allowed and numbers are not allowed
const nameRegEx: RegExp = /^((?!\w\D+$){,45}.)/;

// Regular Expression for username
// Needs at least 5 alphanumerics and a limit of 40 alphanumerics 
const usernameRegEx: RegExp = /^((?![a-zA-Z0-9_]{5,45}).)*$/;

// Regular Expression for email
// Needs alphanumerics before the @ which follows with a dot and 2-4 letters 
const emailRegEx: RegExp = /^((?![\w-\.]+@([\w-]+\.)+[\w-]{2,4}).)*$/;

// Regular Expression for password
// Minimum eight and maximum 60 characters, at least one uppercase letter, one lowercase letter, one number and one special character
const passwordRegEx: RegExp = /^((?!(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,60}$).)*$/;


/**
 * Deze methode wordt aangeroepen als de pagina is geladen, dat gebeurt helemaal onderin!
 */
function setup(): void {
    // Maak een actie aan voor de login knop. Als je hier op drukt wordt de code tussen de { } aangeroepen
    document.querySelector("#signupButton")?.addEventListener("click", async () => {

        // loops through all the emails that exists in the database
        for( const email of emailData) {
            if (firstnameInput && lastnameInput && usernameInput && emailInput && passwordInput) {
            // If the username input OR email input OR password input are empty
            // Then an alert will be displayed which disappears in 3000 ms
                if (firstnameInput.value === "" || lastnameInput.value === "" || usernameInput.value === "" || emailInput.value === "" || passwordInput.value === "" ) {
                    const textInput: string = "There are empty fields!";
                    alertPopUp(textInput);
                    return;
                }
                // firstname validation
                else if (firstnameInput.value.match(nameRegEx)) {
                    const textInput: string = "Only alphabetic letters are allowed!";
                    // Calls the alertPopUp function and sends the assigned data
                    alertPopUp(textInput);
                }
                // lastname validation
                else if (lastnameInput.value.match(nameRegEx)) {
                    const textInput: string = "Only alphabetic letters are allowed!";
                    // Calls the alertPopUp function and sends the assigned data
                    alertPopUp(textInput);
                }
                // username validation
                else if (usernameInput.value.match(usernameRegEx)) {
                    const textInput: string = "Username needs at least 5 alphanumerics!";
                    // Calls the alertPopUp function and sends the assigned data
                    alertPopUp(textInput);
                }
                // email validation
                else if (emailInput.value.match(emailRegEx)) {
                    const textInput: string = "Your email does not exist!";
                    // Calls the alertPopUp function and sends the assigned data
                    alertPopUp(textInput);
                }
                // checks if email already exists using the for loop
                else if (emailInput.value === email.email) {
                    const textInput: string = "Your email already has an existing account!";
                    // Calls the alertPopUp function and sends the assigned data
                    alertPopUp(textInput);
                    return;
                }
                // password validation
                else if (passwordInput.value.match(passwordRegEx)) {
                    const textInput: string = "Your password needs a minimum of eight characters, at least one uppercase letter, one lowercase letter, one number and one special character.";
                    // Calls the alertPopUp function and sends the assigned data
                    alertPopUp(textInput);
                }
                else {
                // Calls the signUpDatabase function and sends the assigned data
                    await signUpDatabase(firstnameInput.value, lastnameInput.value, usernameInput.value, emailInput.value, passwordInput.value);
                    console.log("registered!");
                    document.getElementsByTagName("main")[0].setAttribute("style", "display:none");
                    document.getElementsByTagName("section")[0].setAttribute("style", "display:block");
                    await delay(5000);
                    url.redirect("login.html");
                } 
            };
        }
    });
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
async function signUpDatabase(firstnameInput: string, lastnameInput: string, usernameInput: string, emailInput: string, passwordInput: string): Promise<Array<any> | undefined> {
    // proberen de data op te halen uit de database
    try {
        let dataString: string[] = [firstnameInput, lastnameInput, usernameInput, passwordInput, emailInput];
        const data: any = await api.queryDatabase(
            "INSERT INTO user (firstname, lastname, username, password, email) VALUES (?,?,?,?,?)",
            ...dataString
        );

        return data;
    } catch (error) {
        // als het niet lukt de data op te halen, geef een lege array terug
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
    await delay(5000);
    document.getElementsByClassName("alert-danger")[0].setAttribute("style", "display: none");
}

// Roep de setup functie aan als de pagina is geladen
setup();