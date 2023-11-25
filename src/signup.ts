import { delay } from "./components/delay";
import "./config";
import { api } from "@hboictcloud/api";

// Haal de waarden uit de inputvelden met het id username, email and password
const username: any = (document.getElementById("username") as HTMLInputElement);
const email: any = (document.getElementById("email") as HTMLInputElement);
const password: any = (document.getElementById("password") as HTMLInputElement);

// Regular Expression for username
// Needs at least 5 alphanumerics and a limit of 40 alphanumerics 
const usernameRegEx: RegExp = /^((?![a-zA-Z0-9_]{5,40}).)*$/g;

// Regular Expression for email
// Needs alphanumerics before the @ which follows with a dot and 2-4 letters 
const emailRegEx: RegExp = /^((?![\w-\.]+@([\w-]+\.)+[\w-]{2,4}).)*$/g;

// Regular Expression for password
// Minimum eight and maximum 60 characters, at least one uppercase letter, one lowercase letter, one number and one special character
const passwordRegEx: RegExp = /^((?!(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,60}$).)*$/g;


/**
 * Deze methode wordt aangeroepen als de pagina is geladen, dat gebeurt helemaal onderin!
 */
function setup(): void {
    // Maak een actie aan voor de login knop. Als je hier op drukt wordt de code tussen de { } aangeroepen
    document.querySelector("#signupButton")?.addEventListener("click", async () => {

        if(username && email && password) {
            // If the username input OR email input OR password input are empty
            // Then an alert will be displayed which disappears in 3000 ms
            if (username.value === "" || email.value === "" || password.value === "" ) {
                const textInput: string = "There are empty fields!";
                alertPopUp(textInput);
            }
            // username validation
            else if (username.value.match(usernameRegEx)) {
                const textInput: string = "Username needs at least 5 alphanumerics!";
                // Calls the alertPopUp function and sends the assigned data
                alertPopUp(textInput);
            }
            // checks if email already exists

            // email validation
            else if (email.value.match(emailRegEx)) {
                const textInput: string = "Your email does not exist!";
                // Calls the alertPopUp function and sends the assigned data
                alertPopUp(textInput);
            }
            // password validation
            else if (password.value.match(passwordRegEx)) {
                const textInput: string = "Your password needs a minimum of eight characters, at least one uppercase letter, one lowercase letter, one number and one special character.";
                // Calls the alertPopUp function and sends the assigned data
                alertPopUp(textInput);
            }
            else {
                // Calls the signUpDatabase function and sends the assigned data
                signUpDatabase(username.value, email.value, password.value);
                console.log("registerd!");
            } 
        };
    });
}



/**
 *
 * @param username
 * @param email
 * @param password
 * @returns Array with the user data
 */
async function signUpDatabase(username: string, email: string, password: string): Promise<Array<any> | undefined> {
    // proberen de data op te halen uit de database
    try {
        let dataString: string[] = [username, password, email];
        const data: any = await api.queryDatabase(
            "INSERT INTO user (username, password, email) VALUES (?,?,?)",
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
