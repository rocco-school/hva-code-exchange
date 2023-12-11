import "./config";
import {Question} from "./models/question";
import {getQuestion} from "./components/utils/getQuestion";

// Declare eventId at a higher scope, making it accessible to multiple functions.
let questionId: string | any = "";

/**
 * The main application entry point for the single-question page.
 *
 * This function initializes the single-question page, including event handling,
 * user verification, and other related functionality.
 *
 * @returns {Promise<void>} A Promise that resolves when the application setup is complete.
 */
async function setup(): Promise<void> {
    // Check URL parameters and extract necessary information.
    await checkURLParams();

    // Retrieves a question from the database based on the URL parameter question ID.
    const question: Question | undefined = await getQuestion(questionId);

    if (!question) location.replace("index.html");

    (<HTMLInputElement>document.querySelector(".question-title")).innerHTML = <string>question?.questionTitle;
    (<HTMLInputElement>document.querySelector(".question-body")).innerHTML = <string>question?.questionBody;


}

// Invoke the question detail page application entry point.
await setup();


/**
 * Function to check and retrieve the `questionId` from the URL parameters.
 *
 * This function parses the URL parameters and retrieves the `questionId` if it exists
 * in the URL. The `eventId` is used to identify the current event for various operations.
 *
 * @returns {Promise<void>}
 */
async function checkURLParams(): Promise<void> {
    try {
        // Create a URLSearchParams object to parse the URL parameters.
        let params: URLSearchParams = new URLSearchParams(location.search);

        // Check if the "questionId" parameter exists in the URL.
        const checkedParam: string | null = params.get("question");

        if (checkedParam) {
            // Set the global "questionId" variable to the retrieved value.
            questionId = checkedParam;
        }
    } catch (e) {
        console.log(e);
    }
}