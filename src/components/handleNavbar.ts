import {JWTPayload} from "jose";
import {User} from "../models/user";
import {endUserSession} from "./handleUserSession";

/**
 * Handle authentication and update UI elements accordingly.
 * @returns {Promise<JWTPayload | boolean>} A promise that resolves to the authentication status or JWT payload.
 */
export async function handleAuthentication(isAuthenticated: JWTPayload | boolean): Promise<any> {
    try {

        const loggedOutBlock: HTMLElement = (<HTMLElement>document.querySelector(".logged-out"));
        const profileBlock: HTMLElement = (<HTMLElement>document.querySelector(".profile-block"));

        if (!isAuthenticated) {
            // If not authenticated, display the logged-out block.
            loggedOutBlock.classList.remove("hidden");
        }

        if (isAuthenticated) {
            // If authenticated, fetch user details and display the profile block.
            const profilePicture: HTMLImageElement = (<HTMLImageElement>document.querySelector(".profilePicture"));
            const userDropdown: HTMLElement = (<HTMLElement>document.querySelector(".userDropdown"));
            const nameCardUsername: HTMLElement = (<HTMLElement>document.querySelector(".nameCardUsername"));
            const nameCardEmail: HTMLElement = (<HTMLElement>document.querySelector(".nameCardEmail"));
            const signOutButton: HTMLElement = (<HTMLElement>document.querySelector(".signOut"));
            const profileButton: HTMLElement = (<HTMLElement>document.querySelector("#profileButton"));

            profileButton.parentElement?.classList.remove("hidden");

            // @ts-ignore
            const userId: number = isAuthenticated["userId"] as number;
            const user: User = await User.retrieveUser(userId) as User;

            profilePicture.src = user.profilePicture ?? "https://ui-avatars.com/api/?name=" + user.firstname + "+" + user.lastname + "&background=random";

            profilePicture.addEventListener("click", (): void => {
                // Update the name and email in the UI.
                nameCardUsername.innerHTML = user.firstname + " " + user.lastname;
                nameCardEmail.innerHTML = user.email;

                // Toggle the visibility of the user dropdown.
                userDropdown.classList.toggle("hidden");
                console.log("toggled!");

                signOutButton.addEventListener("click", endUserSession);
            });

            profileBlock.classList.remove("hidden");
        }

        // Return the authentication status or JWT payload.
        return isAuthenticated;
    } catch (error) {
        console.error("Error handling authentication:", error);
        // Handle or propagate the error as needed.
    }
}