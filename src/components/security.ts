import {session, url} from "@hboictcloud/api";

/**
 * Checks the security status of the user session.
 * If the session with the name "user" does not exist or is undefined,
 * redirects the user to the login page.
 */
export function security(): void {
    // If the session with the name "user" does not exist or is undefined,
    // it means the user is not logged in.
    if (!session.get("user") || session.get("user") === undefined) {
        // Redirect the user to the login page.
        url.redirect("login.html");
    }
}

/**
 * Checks the security status of the user session.
 * Returns true if the user is logged in; otherwise, returns false.
 * @returns {boolean} The security status of the user session.
 */
export function checkSecurity(): boolean {
    // Check if the session with the name "user" exists and is not undefined,
    // indicating that the user is logged in.
    return !(!session.get("user") || session.get("user") === undefined);
}