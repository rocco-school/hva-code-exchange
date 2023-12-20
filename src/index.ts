import "./config";
import {url} from "@hboictcloud/api";

/**
 * Deze methode wordt aangeroepen als de pagina is geladen, dat gebeurt helemaal onderin!
 */
async function setup(): Promise<void> {
    // Get references to various HTML elements
    const signupButton: HTMLButtonElement | null = document.querySelector("#signupButton");
    const loginButton: HTMLButtonElement | null = document.querySelector("#loginButton");

    const burgerMenu: HTMLImageElement | null = document.querySelector("#burgerMenu");
    const sidebarClose: HTMLImageElement | null = document.querySelector("#sidebarClose");
    const sidebarMenu: HTMLElement | null = document.querySelector(".sidebarMenu");

    const homeButton: HTMLButtonElement | null = document.querySelector("#homeButton");
    const aboutButton: HTMLButtonElement | null = document.querySelector("#aboutButton");
    const questionsButton: HTMLButtonElement | null = document.querySelector("#questionsButton");

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
        console.log("class added");
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
// Run the setup function when the page is loaded
await setup();
