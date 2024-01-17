import "./config";
import {handleButtonClick} from "./components/customSelect";
import {JWTPayload} from "jose";
import {security} from "./components/security";
import {url} from "@hboictcloud/api";
import {initializeTextEditor} from "./components/initializeTextEditor";
import {Question} from "./models/question";
import {showSuccessMessage} from "./components/successMessage";
import {handleRedirectToQuestionDetail} from "./components/handleRedirects";
import {populateTagSelect} from "./components/handleCustomSelect";
import {initializeTagSelect} from "./components/initializeSelect";

/**
 * The main application entry point for the create-question page.
 *
 * This function initializes the create-question page, including event handling,
 * user verification, and other related functionality.
 *
 * @returns {Promise<void>} A Promise that resolves when the application setup is complete.
 */
async function setup(): Promise<void> {
    // Check the security status by calling the 'security' function.
    const loginStatus: JWTPayload | boolean = await security();

    // If the user is authenticated (loginStatus is true), redirect them to the index.html page.
    if (!loginStatus) {
        url.redirect("/questions.html");
    }

    // Initialize the text Editor.
    await initializeTextEditor();

    await initializeTagSelect();

    // Select all elements with the class "custom-select"
    const postButton: HTMLButtonElement = (<HTMLButtonElement>document.querySelector(".btn_submit"));
    const textarea: HTMLDivElement = (<HTMLDivElement>document.querySelector("#text-input"));
    const questionTitleInput: HTMLInputElement = (<HTMLInputElement>document.querySelector(".question-title-input"));


    // Add a click event listener to the submit button to handle the click
    postButton!.addEventListener("click", async function (): Promise<void> {
        let questionTags: any[] = [];
        let questionTitle: string = "";
        let questionBody: string = "";

        // Use the async function handleButtonClick when the submit button is clicked
        await handleButtonClick().then((result: string | null): void => {
            if (result !== null) {
                // Handle the valid result
                const tags: string[] = result.split(", ");

                for (const tagsKey in tags) {
                    questionTags.push(tags[tagsKey]);
                }
            } else {
                // Handle the case where the input is not valid
                console.log("Input is not valid.");
            }
        });

        // Get values from input fields
        if (questionTitleInput) {
            questionTitle = questionTitleInput.value;
        }

        if (textarea) {
            questionBody = textarea.innerHTML;
        }

        //Check if necessary data is available
        if (questionTitle && questionBody && questionTags.length !== 0) {
            // Get user ID from login status
            // @ts-ignore
            const userId: number = loginStatus["userId"];

            // Create a new Question object
            const questionObject: Question = new Question(
                null,
                userId,
                questionTitle,
                questionBody,
                false,
                null,
                null,
                null,
                null,
            );

            // Save the question and get the result
            const question: Question = await questionObject.saveQuestion() as Question;

            if (question) {
                // Insert question tags associated with the question

                if (!question.questionId) return;

                const createQuestionTags: boolean = await Question.insertQuestionTag(question.questionId, questionTags) as boolean;

                if (createQuestionTags) {
                    await showSuccessMessage("Successfully created Question!", 5000, "success", null, null);
                    await handleRedirectToQuestionDetail(question.questionId);
                }

            }
        }
    });
}

// Invoke the question detail page application entry point.
await setup();




