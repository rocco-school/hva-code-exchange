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


// import "./config";
// import { api, session, url } from "@hboictcloud/api";
// import { User } from "./models/user";

// /**
//  * Deze methode wordt aangeroepen als de pagina is geladen, dat gebeurd helemaal onderin!
//  */
// async function setup(): Promise<void> {
//     // Kijk of de gebruiker is ingelogd anders mag je hier niet komen.
//     security();

//     // Maak een actie aan voor de logout knop. Als je hier op drukt wordt de logout functie aangeroepen
//     document.querySelector(".logout-btn")?.addEventListener("click", logout);

//     // Haal alle gegevens van de gebruiker op uit de database en stop dat in het model User
//     const user: User | undefined = await getUserInfo(session.get("user"));

//     // vul naam is uit het object in de sessie
//     if (user) {
//         document.querySelector(".name")!.innerHTML = user.firstname + " " + user.lastname;
//     }
// }

// /**
//  * Check if the user is logged in
//  * De methode geeft niets terug (void) en heeft daarom geen return statement
//  */
// function security(): void {
//     // Als de sessie met naam user_id niet bestaat (door de ! werkt de if als nietwaar) dan is de gebruiker niet ingelogd
//     if (!session.get("user") || session.get("user") === undefined) {
//         // Stuur de gebruiker door naar de login pagina
//         url.redirect("login.html");
//     }
// }

// /**
//  * Haal alle gegevens van de gebruiker op uit de database
//  * @param id
//  * @returns user object
//  */
// async function getUserInfo(userid: number): Promise<User | undefined> {
//     try {
//         const data: any = await api.queryDatabase("SELECT * FROM user WHERE id = ?", userid);

//         if (data.length > 0) {
//             const user: User = new User(
//                 data[0]["id"],
//                 data[0]["username"],
//                 data[0]["email"],
//                 data[0]["firstname"],
//                 data[0]["lastname"]
//             );
//             return user;
//         }
//         return undefined;
//     } catch (error) {
//         console.error(error);

//         return undefined;
//     }
// }

// /**
//  * Logout van de gebruiker door de sessie te verwijderen
//  * De methode geeft niets terug (void) en heeft daarom geen return statement
//  */
// function logout(): void {
//     // Verwijder de sessies
//     session.remove("user");

//     // Stuur de gebruiker door naar de login pagina
//     url.redirect("login.html");
// }

// // Run bij het opstarten de setup functie
// await setup();
