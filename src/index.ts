import { redirect } from "./components/redirect";

/**
 * Deze methode wordt aangeroepen als de pagina is geladen, dat gebeurd helemaal onderin!
 */
async function setup(): Promise<void> {
    const signupButton: HTMLButtonElement | null = document.querySelector("#signupButton");
    const loginButton: HTMLButtonElement | null = document.querySelector("#loginButton");

    signupButton?.addEventListener("click", () => {
        redirect("signup.html");
    });

    
}

// Run bij het opstarten de setup functie
setup();
