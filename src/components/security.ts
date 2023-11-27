import {session, url} from "@hboictcloud/api";

/**
 * Check if the user is logged in
 * De methode geeft niets terug (void) en heeft daarom geen return statement
 */
export function security(): void {
    // Als de sessie met naam user_id niet bestaat (door de ! werkt de if als nietwaar) dan is de gebruiker niet ingelogd
    if (!session.get("user") || session.get("user") === undefined) {
        // Stuur de gebruiker door naar de login pagina
        url.redirect("login.html");
    }
}