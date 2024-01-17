import "./config";
import {
    addClickListenersToOptions,
    handleButtonClick,
    handleDocumentClick,
    setupCustomSelect,
    setupSelectBoxClickHandling,
    updateSelectedOptions
} from "./components/customSelect";
import {CodingTag} from "./models/codingTag";
import {JWTPayload} from "jose";
import {security} from "./components/security";
import {url} from "@hboictcloud/api";
import {initializeTextEditor} from "./components/initializeTextEditor";
import {Question} from "./models/question";
import {showSuccessMessage} from "./components/successMessage";
import {handleRedirectToQuestionDetail} from "./components/handleRedirects";

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
        url.redirect("/question-list.html");
    }

    const selectOptions: Element | null = document.querySelector(".options");
    if (selectOptions) await populateTagSelect(selectOptions);

    // Initialize the text Editor.
    await initializeTextEditor();

    // Select all elements with the class "custom-select"
    const customSelects: NodeListOf<Element> = document.querySelectorAll(".custom-select");
    const postButton: HTMLButtonElement | null = document.querySelector(".btn_submit");
    const textarea: HTMLDivElement | null = document.querySelector("#text-input");
    const questionTitleInput: HTMLInputElement | null = document.querySelector(".question-title-input");
    const selectBoxes: NodeListOf<Element> = document.querySelectorAll(".select-box");

    // Update selected options for each custom select
    customSelects.forEach(item => {
        updateSelectedOptions(item);
    });

    // Apply setup to all custom select elements
    customSelects.forEach(setupCustomSelect);

    // Add click event listeners to options within each custom select
    customSelects.forEach(addClickListenersToOptions);

    // Add a click event listener to the document for handling custom select elements and removing tags
    document.addEventListener("click", handleDocumentClick);

    // Set up click event handling for select boxes
    setupSelectBoxClickHandling(selectBoxes);

    // Update selected options for the first custom select (assuming there's at least one)
    updateSelectedOptions(customSelects[0]);

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
            const question: Question | string = await questionObject.saveQuestion() as Question;

            if (question) {
                // Insert question tags associated with the question

                if (!question.questionId) return;

                const createQuestionTags: boolean | string = await Question.insertQuestionTag(question.questionId, questionTags);

                console.log(createQuestionTags);

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

/**
 * Fetches the list of coding tags and populates the select options.
 *
 * @param {Element} optionsBody - The container element where the select options will be appended.
 * @returns {Promise<void>} - A Promise that resolves to undefined when the function completes.
 */
async function populateTagSelect(optionsBody: Element): Promise<void> {
    // Fetch the list of coding tags from the server
    const codingTags: CodingTag[] | string = await CodingTag.getCodingTags();

    // If no coding tags were returned, return early
    if (codingTags.length === 0) return;

    // Iterate over each coding tag
    for (const codingTag of codingTags) {
        // Type assertion to ensure codingTag is an instance of CodingTag
        const tag: CodingTag = codingTag as CodingTag;

        // Create a new select option with the coding tag's name and id
        const newOption: string = "<div class=\"option\" tabindex=\"0\" data-value=\"" + tag.tagId + "\">" + tag.tagName + "</div>";

        // Append the new option to the options container
        optionsBody.innerHTML += newOption;
    }
}


