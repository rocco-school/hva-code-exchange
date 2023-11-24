import { delay } from "./components/delay";
import "./config";
import { api, url } from "@hboictcloud/api";

// Haal de waarden uit de inputvelden met het id username, email and password
const username: any = (document.getElementById("username") as HTMLInputElement);
const email: any = (document.getElementById("email") as HTMLInputElement);
const password: any = (document.getElementById("password") as HTMLInputElement);

// Regular Expression for the username
// const usernameRegExp = ;

// Regular Expression for the email
const emailRegExp: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
/**
 * Deze methode wordt aangeroepen als de pagina is geladen, dat gebeurt helemaal onderin!
 */
function setup(): void {
    // Maak een actie aan voor de login knop. Als je hier op drukt wordt de code tussen de { } aangeroepen
    document.querySelector("#signinButton")?.addEventListener("click", async () => {

        // If the username input OR email input OR password input are empty
        // Then an alert will be displayed which disappears in 3000 ms
        if(username && email && password) {
            if (username.value === "" || email.value === "" || password.value === "" ) {
                document.getElementsByClassName("alert-danger")[0].setAttribute("style", "display: block");
                await delay(3000);
                document.getElementsByClassName("alert-danger")[0].setAttribute("style", "display: none");
            }
            // username validation
            // else if (username.value !== usernameRegExp) {
            //     console.log("voldoet niet aan username eisen");
            // }
            //email validation
            else if (email.value !== emailRegExp) {
                console.log("uw email bestaat niet");
            }

            // password validation
        } else {
            // Calls the signUpDatabase function
            signUpDatabase(username.value, email.value, password.value);
                
        } 
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
    console.log("inside signup");
    try {
        let dataString: string[] = [username, password, email];
        console.log(dataString, "datastring");
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

// Roep de setup functie aan als de pagina is geladen
setup();
