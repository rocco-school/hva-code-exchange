import "./config";
import {api, url} from "@hboictcloud/api";
import {handleAuthentication} from "./components/handleNavbar";
import {JWTPayload} from "jose";
import {security} from "./components/security";
import {delay} from "./components/delay";
import {QUESTION_QUERY} from "./query/question.query";
import {Question} from "./models/question";
import {createNewQuestionInstance} from "./components/handleModelInstances";
import {User} from "./models/user";
import {CodingTag} from "./models/codingTag";
import {createQuestionElement} from "./components/htmlTemplate";
import {handleRedirectToQuestionDetail} from "./components/handleRedirects";
import DOMPurify from "dompurify";

/**
 * Deze methode wordt aangeroepen als de pagina is geladen, dat gebeurt helemaal onderin!
 */
async function setup(): Promise<void> {

    // Check the security status by calling the 'security' function.
    const isAuthenticated: JWTPayload | boolean = await security();

    await handleAuthentication(isAuthenticated);

    await highlightPageItem();

    await displayRecentQuestions();

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
    signupButton?.addEventListener("click", async () => {
        signupButton.classList.add("signButtonFocus");
        await delay(100);
        signupButton.classList.remove("signButtonFocus");
        url.redirect("signup.html");
    });

    loginButton?.addEventListener("click", async () => {
        loginButton.classList.add("logButtonFocus");
        await delay(100);
        loginButton.classList.remove("logButtonFocus");

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
    const questionsButton: HTMLButtonElement = (<HTMLButtonElement>document.querySelector("#questionsButton"));
    const profileButton: HTMLButtonElement = (<HTMLButtonElement>document.querySelector("#profileButton"));

    // Remove the "active" class from all items
    homeButton.classList.remove("current-page");
    questionsButton.classList.remove("current-page");
    profileButton.classList.remove("current-page");

    // Determine which item to highlight based on the current page URL
    if (currentUrl.includes("/questions.html")) {
        questionsButton.parentElement?.classList.add("current-page");
    } else if (currentUrl === "/" || currentUrl.includes("/index.html")) {
        homeButton.parentElement?.classList.add("current-page");
    } else if (currentUrl.includes("/user-page.html")) {
        profileButton.parentElement?.classList.add("current-page");
    }
}

/**
 * Fetches recent questions from the database and displays them in the specified HTML element.
 */
async function displayRecentQuestions(): Promise<void> {
    try {
        // Fetch recent questions from the database using an API call
        const recentQuestions: [Question] = await api.queryDatabase(QUESTION_QUERY.SELECT_RECENT_SIX_QUESTIONS) as [Question];

        // Select the HTML element where recent questions will be displayed
        const recentQuestionsBody: Element = (<Element>document.querySelector(".questions-table"));

        // Iterate over each recent question
        for (const question of recentQuestions) {
            await processSingleQuestion(question, recentQuestionsBody);
        }
    } catch (e) {
        // Handle any errors that occur during the execution of the function
        console.error(e);
    }
}

/**
 * Processes a single question, retrieves user details, and creates the question element.
 * @param {Question} question - The question to process.
 * @param {HTMLElement} recentQuestionsBody - The HTML element where recent questions will be displayed.
 */
async function processSingleQuestion(question: Question, recentQuestionsBody: Element): Promise<void> {
    const singleQuestion: Question = createNewQuestionInstance(question);

    const userId: number = singleQuestion.userId as number;
    const questionId: number = singleQuestion.questionId as number;
    const questionBody: string = singleQuestion.questionBody as string;
    let questionUsername: string = "Unknown user";
    let questionTagString: string = "Unknown";

    // Retrieve user details
    const user: User = await User.retrieveUser(userId) as User;

    if (user) {
        questionUsername = user.username;
    }

    // Retrieve coding tags for the question
    const questionTags: [CodingTag] = await CodingTag.getAllCodingTagsForQuestion(questionId) as [CodingTag];

    if (questionTags.length > 0) {
        const uniqueTagIds: string[] = [...new Set(questionTags.map(item => item.tagName))];
        questionTagString = uniqueTagIds.join(", ");
    }

    // Create the question element
    const questionElement: string = createQuestionElement(
        singleQuestion.questionTitle.slice(0, 30),
        questionUsername,
        questionTagString,
        singleQuestion.questionTitle,
        questionBody.slice(0, 170) + "...",
        questionId.toString()
    );

    const sanitized: string = DOMPurify.sanitize(questionElement);

    recentQuestionsBody.innerHTML += sanitized;

    // Add click event listener to the question body
    const questionBodyElem: NodeListOf<Element> = (<NodeListOf<Element>>document.querySelectorAll(".question-body"));

    questionBodyElem.forEach(item => {
        item.addEventListener("click", async () => {
            const questionId: number = parseInt(item.id);
            await handleRedirectToQuestionDetail(questionId);
        });
    });
}
