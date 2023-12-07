import "./config";
import { api, session, url } from "@hboictcloud/api";
import { User } from "./models/user";
import {security} from "./components/security";
import {JWTPayload} from "jose";

/**
 * Deze methode wordt aangeroepen als de pagina is geladen, dat gebeurd helemaal onderin!
 */
async function setup(): Promise<void> {
    // Maak een actie aan voor de logout knop. Als je hier op drukt wordt de logout functie aangeroepen
    document.querySelector(".logout-btn")?.addEventListener("click", logout);

    // Haal alle gegevens van de gebruiker op uit de database en stop dat in het model User
    const user: User | undefined = await getUserInfo(session.get("user"));

    // vul naam is uit het object in de sessie
    if (user) {
        document.querySelector(".name")!.innerHTML = user.firstname + " " + user.lastname;
    }
}

/**
 * Haal alle gegevens van de gebruiker op uit de database
 * @param id
 * @returns user object
 */
async function getUserInfo(userid: number): Promise<User | undefined> {
    try {
        const data: any = await api.queryDatabase("SELECT * FROM user WHERE id = ?", userid);

        if (data.length > 0) {
            const user: User = new User(
                data[0]["id"],
                data[0]["username"],
                data[0]["email"],
                data[0]["firstname"],
                data[0]["lastname"]
            );
            return user;
        }
        return undefined;
    } catch (error) {
        console.error(error);

        return undefined;
    }
}

/**
 * Logout van de gebruiker door de sessie te verwijderen
 * De methode geeft niets terug (void) en heeft daarom geen return statement
 */
function logout(): void {
    // Verwijder de sessies
    session.remove("user");

    // Stuur de gebruiker door naar de login pagina
    url.redirect("login.html");
}

// Run bij het opstarten de setup functie
await setup();
