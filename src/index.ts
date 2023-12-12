import { redirect } from "./components/redirect";

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
        redirect("signup.html");
    });

    loginButton?.addEventListener("click", () => {
        redirect("login.html");
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
        redirect("index.html");
    });

    aboutButton?.addEventListener("click", () => {
        // Redirect to the about page (or '#' if not specified)
        redirect("#");
    });

    questionsButton?.addEventListener("click", () => {
        // Redirect to the questions page
        redirect("homepage.html");
    });
}

// Run bij het opstarten de setup functie
// Run the setup function when the page is loaded
setup();


