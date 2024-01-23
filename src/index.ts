import "./config";
import {url} from "@hboictcloud/api";
import {handleAuthentication} from "./components/handleNavbar";
import {JWTPayload} from "jose";
import {security} from "./components/security";

/**
 * Deze methode wordt aangeroepen als de pagina is geladen, dat gebeurt helemaal onderin!
 */
async function setup(): Promise<void> {

    // Check the security status by calling the 'security' function.
    const isAuthenticated: JWTPayload | boolean = await security();

    await handleAuthentication(isAuthenticated);

    await highlightPageItem();

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
        sidebarMenu?.classList.toggle("show");

        if (sidebarMenu.classList.contains("show")) {
            burgerMenu.src = "assets/img/svg/burgerMenuClose.svg";
        }

        if (!sidebarMenu.classList.contains("show")) {
            burgerMenu.src = "assets/img/svg/burgerMenu.svg";
        }
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


async function highlightPageItem(): Promise<void> {
    // Get the current page URL
    const currentUrl: string = window.location.pathname;

    // Define the IDs of the navigation items
    const homeButton: HTMLButtonElement = (<HTMLButtonElement>document.querySelector("#homeButton"));
    const aboutButton: HTMLButtonElement = (<HTMLButtonElement>document.querySelector("#aboutButton"));
    const questionsButton: HTMLButtonElement = (<HTMLButtonElement>document.querySelector("#questionsButton"));
    const profileButton: HTMLButtonElement = (<HTMLButtonElement>document.querySelector("#profileButton"));

    // Remove the "active" class from all items
    homeButton.classList.remove("current-page");
    aboutButton.classList.remove("current-page");
    questionsButton.classList.remove("current-page");
    profileButton.classList.remove("current-page");

    // Determine which item to highlight based on the current page URL
    if (currentUrl.includes("/homepage.html")) {
        homeButton.parentElement?.classList.add("current-page");
    } else if (currentUrl.includes("/questions.html")) {
        questionsButton.parentElement?.classList.add("current-page");
    } else if (currentUrl === "/" || currentUrl.includes("/index.html")) {
        aboutButton.parentElement?.classList.add("current-page");
    } else if (currentUrl.includes("/user-page.html")) {
        profileButton.parentElement?.classList.add("current-page");
    }
}


