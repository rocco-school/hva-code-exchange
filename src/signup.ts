import { delay } from "./components/delay";
import "./config";
import { api, session, url } from "@hboictcloud/api";

/**
 * Deze methode wordt aangeroepen als de pagina is geladen, dat gebeurt helemaal onderin!
 */
function setup(): void {
    // Maak een actie aan voor de login knop. Als je hier op drukt wordt de code tussen de { } aangeroepen
    document.querySelector("#signinButton")?.addEventListener("click", async () => {
        // Haal de waarden uit de inputvelden met het id username, email and password
        const username: string = (<HTMLInputElement>document.getElementById("username")).value;
        const email: string = (<HTMLInputElement>document.getElementById("email")).value;
        const password: string = (<HTMLInputElement>document.getElementById("password")).value;

        // If the username input OR email input OR password input are empty
        // Then an alert will be displayed which disappears in 3000 ms
        if (username === "" || email === "" || password === "" ) {
            document.getElementsByClassName("alert-danger")[0].setAttribute("style", "display: block");
            await delay(3000);
            document.getElementsByClassName("alert-danger")[0].setAttribute("style", "display: none");
        } else {
            // Calls the signUpDatabase function
            // clears the username, email and password input
            // Then redirects you to login 
            signUpDatabase;
            (<HTMLInputElement>document.getElementById("username")).value = "";
            (<HTMLInputElement>document.getElementById("email")).value = "";
            (<HTMLInputElement>document.getElementById("password")).value = "";
            url.redirect("/login.html");
        }

        // Roep de loginFromDatabase functie aan (op regel 50) en geef username en password mee
        // try {
        //     const data: any = await signUpDatabase(username, email, password);
            
        //     if (data.length > 0) {
        //         // Maak user object aan met de waarden uit de database
        //         // Sla de gebruikersgegevens op in een sessie
        //         session.set("user", data[0].id);

        //         // Stuur de gebruiker door naar de homepagina
        //         url.redirect("/index.html");
        //     } else {
        //         // Als de gebruiker niet bestaat, geef melding aan gebruiker door in de css (bootstrap) de display op block te zetten
        //         document.getElementsByClassName("alert-danger")[0].setAttribute("style", "display: block");
        //         await delay(3000);
        //         document.getElementsByClassName("alert-danger")[0].setAttribute("style", "display: none");
                
        //         // Maak de inputvelden weer leeg
        //         (<HTMLInputElement>document.getElementById("username")).value = "";
        //         (<HTMLInputElement>document.getElementById("email")).value = "";
        //         (<HTMLInputElement>document.getElementById("password")).value = "";
        //     }
        // } catch (error) {
        //     // als het niet lukt de data op te halen, geef de gebruiker een foutmelding
        //     console.log("Fout bij registreren");
        // }
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
        let dataString: string[] = [username, email, password];
        const data: any = await api.queryDatabase(
            "INSERT INTO user (username, email, passqord) VALUES (?,?,?)",
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



