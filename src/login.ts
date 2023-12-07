import { delay } from "./components/delay";
import "./config";
import { api, session, url } from "@hboictcloud/api";

/**
 * The main application entry point for the login page.
 *
 * This function initializes the login page, including event handling,
 * user verification, and other related functionality.
 *
 * @returns {Promise<void>} A Promise that resolves when the application setup is complete.
 */
function setup(): void {
    // Maak een actie aan voor de login knop. Als je hier op drukt wordt de code tussen de { } aangeroepen
    document.querySelector(".login-btn")?.addEventListener("click", async () => {
        // Haal de waarden uit de inputvelden met het id username en password
        const username: string = (<HTMLInputElement>document.getElementById("username")).value;
        const password: string = (<HTMLInputElement>document.getElementById("password")).value;

        // Roep de loginFromDatabase functie aan (op regel 50) en geef username en password mee
        try {
            console.log(username);
            console.log(password);
            const data: any = await loginFromDatabase(username, password);
            
            if (data.length > 0) {

                // Clear session from previous sessions.
                session.clear();
                // Maak user object aan met de waarden uit de database
                // Sla de gebruikersgegevens op in een sessie
                session.set("user", data[0].user_id);

                // Stuur de gebruiker door naar de homepagina
                url.redirect("/index.html");
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
 *
 * @param username
 * @param password
 * @returns Array with the user data
 */
async function loginFromDatabase(username: string, password: string): Promise<string | any[]> {
    // proberen de data op te halen uit de database
    try {
        const param: string[] = [username, password];
        console.log(param, "params");
        return await api.queryDatabase("SELECT * from user WHERE username = ? AND password = ?", ...param);
    } catch (error) {
        // als het niet lukt de data op te halen, geef een lege array terug
        return [];
    }
}

// Invoke the login page application entry point.
await setup();
