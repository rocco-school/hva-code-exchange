import "./config";
import {api} from "@hboictcloud/api";
import {QUESTION_QUERY} from "./query/question.query";
import {Question} from "./models/question";

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
    const question: Question | undefined = await getQuestion();

    if (!question) location.replace("index.html");

    (<HTMLInputElement>document.querySelector(".question-title")).innerHTML = <string>question?.title;
    (<HTMLInputElement>document.querySelector(".question-body")).innerHTML = <string>question?.body;


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


async function getQuestion(): Promise<Question | undefined> {
    try {
        const getQuestion: any = await api.queryDatabase(QUESTION_QUERY.SELECT_QUESTION, questionId);
        if (getQuestion.length > 0) {
            return new Question(
                getQuestion[0]["question_id"],
                getQuestion[0]["user_id"],
                getQuestion[0]["title"],
                getQuestion[0]["body"],
                getQuestion[0]["is_closed"],
                getQuestion[0]["created_at"],
                getQuestion[0]["updated_at"],
            );
        }

        return undefined;
    } catch (e) {
        console.error(e);
    }
}