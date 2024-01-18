import "./config";
import {url} from "@hboictcloud/api";

/**
 * Deze methode wordt aangeroepen als de pagina is geladen, dat gebeurt helemaal onderin!
 */
async function setup(): Promise<void> {
    // Get references to various HTML elements
    const signupButton: HTMLButtonElement = (<HTMLButtonElement>document.querySelector("#signupButton"));
    const loginButton: HTMLButtonElement = (<HTMLButtonElement>document.querySelector("#loginButton"));
    const burgerMenu: HTMLImageElement = (<HTMLImageElement>document.querySelector("#burgerMenu"));
    const sidebarClose: HTMLImageElement = (<HTMLImageElement>document.querySelector("#sidebarClose"));
    const sidebarMenu: HTMLElement = (<HTMLElement>document.querySelector(".sidebarMenu"));
    const homeButton: HTMLButtonElement = (<HTMLButtonElement>document.querySelector("#homeButton"));
    const aboutButton: HTMLButtonElement = (<HTMLButtonElement>document.querySelector("#aboutButton"));
    const questionsButton: HTMLButtonElement = (<HTMLButtonElement>document.querySelector("#questionsButton"));

    // Add event listeners for various buttons
    signupButton?.addEventListener("click", () => {
        url.redirect("signup.html");
    });

    loginButton?.addEventListener("click", () => {
        url.redirect("login.html");
    });

    burgerMenu?.addEventListener("click", () => {
        // Show the sidebar menu when the burger menu is clicked
        sidebarMenu?.classList.add("show");
    });

    sidebarClose?.addEventListener("click", () => {
        // Hide the sidebar menu when the close button is clicked
        sidebarMenu?.classList.remove("show");
    });

    homeButton?.addEventListener("click", () => {
        // Redirect to the home page
        url.redirect("homepage.html");
    });

    aboutButton?.addEventListener("click", () => {
        // Redirect to the about page (or '#' if not specified)
        url.redirect("/");
    });

    questionsButton?.addEventListener("click", () => {
        // Redirect to the questions page
        url.redirect("questions.html");
    });
}

// Run bij het opstarten de setup functie
await setup();


