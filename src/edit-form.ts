import "./config";
import {
    addClickListenersToOptions,
    handleButtonClick,
    handleDocumentClick,
    setupCustomSelect,
    setupSelectBoxClickHandling,
    updateSelectedOptions
} from "./components/customSelect";
import {JWTPayload} from "jose";
import {security} from "./components/security";
import {url} from "@hboictcloud/api";
import {initializeTextEditor} from "./components/initializeTextEditor";
import {populateTagSelect} from "./components/handleCustomSelect";
import {PostType} from "./enum/postType";
import {Question} from "./models/question";
import {CodingTag} from "./models/codingTag";
import {showSuccessMessage} from "./components/successMessage";
import {handleRedirectToQuestionDetail} from "./components/handleRedirects";
import {Answer} from "./models/answer";

/**
 * Main application entry point for the create-question page.
 *
 * Initializes the create-question page, including event handling,
 * user verification, and other related functionality.
 *
 * @returns {Promise<void>} A Promise that resolves when the application setup is complete.
 */
async function setup(): Promise<void> {
    // Check the security status by calling the 'security' function.
    const isAuthenticated: JWTPayload | boolean = await checkAuthentication();

    // If the user is not authenticated, redirect them to the index.html page.
    if (!isAuthenticated) {
        url.redirect("/questions.html");
        return;
    }

    // Extract page parameters from the query string
    const {postType, postId} = extractPageParameters();

    // Populate tag select options if present
    const selectOptions: Element | null = document.querySelector(".options");
    if (selectOptions) {
        await populateTagSelect(selectOptions);
    }

    // Initialize the text editor
    await initializeTextEditor();

    // Get DOM elements
    const {
        customSelects,
        selectBoxes,
        postButton,
        textarea,
        questionTitleInput,
        customSelectOptions,
        titleSection,
        tagSection,
        pageTitle,
    } = getDOMElements();

    // Handle different post types
    await handlePostType(postType, postId, questionTitleInput, textarea, customSelectOptions, pageTitle, titleSection, tagSection);

    // Update selected options for custom select elements
    updateSelectedOptionsForCustomSelects(customSelects);

    // Set up custom select elements
    setupCustomSelectElements(customSelects);

    // Add click event listeners to options within each custom select
    addClickEventListenersToOptions(customSelects);

    // Add a click event listener to the document for handling custom select elements and removing tags
    addDocumentClickEventListener();

    // Set up click event handling for select boxes
    setupSelectBoxClickHandling(selectBoxes);

    // Update selected options for the first custom select (assuming there's at least one)
    updateSelectedOptions(customSelects[0]);

    // Example of invoking the handleQuestionUpdate function
    postButton.addEventListener("click", async (): Promise<void> => {
        if (postType === PostType.QUESTION) {
            await handleQuestionUpdate(postId, questionTitleInput, textarea);
        } else if (postType === PostType.ANSWER) {
            await handleAnswerUpdate(postId, textarea);
        }
    });
}

/**
 * Checks user authentication status.
 *
 * @returns {Promise<JWTPayload | boolean>} A Promise that resolves to the JWT payload if authenticated,
 * or `false` if not authenticated.
 */
async function checkAuthentication(): Promise<JWTPayload | boolean> {
    return await security();
}

/**
 * Extracts page parameters from the query string.
 *
 * @returns {{ postType: string | null; postId: string }} An object containing postType and postId.
 */
function extractPageParameters(): { postType: string | null; postId: string } {
    const urlParams: string = url.getFromQueryString("postType");
    const postId: string = url.getFromQueryString("id");
    const postType: PostType | null = urlParams === PostType.QUESTION ? PostType.QUESTION : urlParams === PostType.ANSWER ? PostType.ANSWER : null;

    return {postType, postId};
}

/**
 * Retrieves DOM elements used in the setup function.
 *
 * @returns {{
 *   customSelects: NodeListOf<Element>,
 *   selectBoxes: NodeListOf<Element>,
 *   postButton: HTMLButtonElement,
 *   textarea: HTMLDivElement,
 *   questionTitleInput: HTMLInputElement,
 *   customSelectOptions: NodeListOf<HTMLDivElement>,
 *   titleSection: HTMLElement,
 *   tagSection: HTMLInputElement,
 *   pageTitle: HTMLElement
 * }} An object containing various DOM elements.
 */
function getDOMElements(): {
    customSelects: NodeListOf<Element>;
    selectBoxes: NodeListOf<Element>;
    postButton: HTMLButtonElement;
    textarea: HTMLDivElement;
    questionTitleInput: HTMLInputElement;
    customSelectOptions: NodeListOf<HTMLDivElement>;
    titleSection: HTMLElement;
    tagSection: HTMLInputElement;
    pageTitle: HTMLElement;
} {
    return {
        customSelects: document.querySelectorAll(".custom-select"),
        selectBoxes: document.querySelectorAll(".select-box"),
        postButton: document.querySelector(".btn_submit") as HTMLButtonElement,
        textarea: document.querySelector("#text-input") as HTMLDivElement,
        questionTitleInput: document.querySelector(".question-title-input") as HTMLInputElement,
        customSelectOptions: document.querySelectorAll(".option"),
        titleSection: document.querySelector(".question-title-section") as HTMLElement,
        tagSection: document.querySelector(".tags-section") as HTMLInputElement,
        pageTitle: document.querySelector(".title") as HTMLElement,
    };
}

/**
 * Handles different post types (QUESTION or ANSWER).
 *
 * @param {string | null} postType - The post type.
 * @param {string} postId - The post ID.
 * @param {HTMLInputElement} questionTitleInput - The question title input element.
 * @param {HTMLDivElement} textarea - The textarea element.
 * @param {NodeListOf<HTMLDivElement>} customSelectOptions - The custom select options.
 * @param {HTMLElement} pageTitle - The page title element.
 * @param {HTMLElement} titleSection - The title section element.
 * @param {HTMLElement} tagSection - The tag section element.
 */
async function handlePostType(
    postType: string | null,
    postId: string,
    questionTitleInput: HTMLInputElement,
    textarea: HTMLDivElement,
    customSelectOptions: NodeListOf<HTMLDivElement>,
    pageTitle: HTMLElement,
    titleSection: HTMLElement,
    tagSection: HTMLElement,
): Promise<void> {
    if (postType === PostType.ANSWER) {
        await handleAnswerPostType(postId, textarea, titleSection, tagSection, pageTitle);
    }

    if (postType === PostType.QUESTION) {
        await handleQuestionPostType(postId, questionTitleInput, textarea, customSelectOptions, pageTitle);
    }
}

/**
 * Handles ANSWER post type.
 *
 * @param {string} postId - The post ID.
 * @param {HTMLDivElement} textarea - The textarea element.
 * @param {HTMLElement} titleSection - The question title section element.
 * @param {HTMLElement} tagSection - The question tag section element.
 * @param {HTMLElement} pageTitle - The page title element.
 */
async function handleAnswerPostType(
    postId: string,
    textarea: HTMLDivElement,
    titleSection: HTMLElement,
    tagSection: HTMLElement,
    pageTitle: HTMLElement
): Promise<void> {
    const answer: Answer = await Answer.retrieveAnswer(parseInt(postId)) as Answer;

    textarea.innerHTML = answer.answerBody;

    titleSection.classList.add("hidden");
    tagSection.classList.add("hidden");
    pageTitle.innerHTML = "Edit answer";
}

/**
 * Handles QUESTION post type.
 *
 * @param {string} postId - The post ID.
 * @param {HTMLInputElement} questionTitleInput - The question title input element.
 * @param {HTMLDivElement} textarea - The textarea element.
 * @param {NodeListOf<HTMLDivElement>} customSelectOptions - The custom select options.
 * @param {HTMLElement} pageTitle - The page title element.
 */
async function handleQuestionPostType(
    postId: string,
    questionTitleInput: HTMLInputElement,
    textarea: HTMLDivElement,
    customSelectOptions: NodeListOf<HTMLDivElement>,
    pageTitle: HTMLElement
): Promise<void> {
    const question: Question = await Question.retrieveQuestion(parseInt(postId)) as Question;
    const codingTags: [CodingTag] = await CodingTag.getAllCodingTagsForQuestion(question.questionId!) as [CodingTag];

    const uniqueTagIds: number[] = [...new Set(codingTags.map((item: { tagId: any }) => item.tagId))];

    customSelectOptions.forEach((item) => {
        const tagId: string = item.getAttribute("data-value") as string;
        if (tagId) {
            const tagNumber: number = parseInt(tagId) as number;
            if (uniqueTagIds.includes(tagNumber)) {
                item.classList.add("active");
            }
        }
    });

    questionTitleInput.value = question.questionTitle;
    textarea.innerHTML = question.questionBody;

    pageTitle.innerHTML = "Edit question";
}


/**
 * Handles the update of an answer.
 *
 * @param {string} postId - The post ID.
 * @param {HTMLDivElement} textarea - The textarea element.
 * @returns {Promise<void>} A Promise that resolves when the update is complete.
 */
async function handleAnswerUpdate(postId: string, textarea: HTMLDivElement): Promise<void> {
    let answerBody: string = "";

    // Get values from input fields
    if (textarea) {
        answerBody = textarea.innerHTML;
    }

    // Check if necessary data is available
    if (answerBody) {
        const answer: Answer = await Answer.retrieveAnswer(parseInt(postId)) as Answer;

        const newAnswer: Answer = new Answer(
            answer.answerId,
            answer.questionId,
            answer.userId,
            answerBody,
            answer.totalUpvotes,
            answer.totalDownvotes,
            answer.isAccepted,
            answer.createdAt,
            answer.updatedAt,
        );

        const updatedAnswer: Answer = await newAnswer.updateAnswer() as Answer;

        if (updatedAnswer) {
            await showSuccessMessage("Successfully updated Answer!", 2000, "success", null, null);
            await handleRedirectToQuestionDetail(answer.questionId);
        }
    }
}

/**
 * Handles the update of a question.
 *
 * @param {string} postId - The post ID.
 * @param {HTMLInputElement} questionTitleInput - The question title input element.
 * @param {HTMLDivElement} textarea - The textarea element.
 * @returns {Promise<void>} A Promise that resolves when the update is complete.
 */
async function handleQuestionUpdate(postId: string, questionTitleInput: HTMLInputElement, textarea: HTMLDivElement): Promise<void> {
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

    // Check if necessary data is available
    if (questionTitle && questionBody && questionTags.length !== 0) {
        const question: Question = await Question.retrieveQuestion(parseInt(postId)) as Question;

        const newQuestion: Question = new Question(
            question.questionId,
            question.userId,
            questionTitle,
            questionBody,
            question.isClosed,
            question.totalUpvotes,
            question.totalDownvotes,
            question.createdAt,
            question.updatedAt,
        );

        const updatedQuestion: Question = await newQuestion.updateQuestion() as Question;

        if (updatedQuestion) {
            if (!question.questionId) return;

            await CodingTag.removeAllQuestionTags(question.questionId);

            const createQuestionTags: boolean | string = await Question.insertQuestionTag(question.questionId, questionTags);

            if (createQuestionTags) {
                await showSuccessMessage("Successfully updated Question!", 2000, "success", null, null);
                await handleRedirectToQuestionDetail(question.questionId);
            }
        }
    }
}


/**
 * Updates selected options for custom select elements.
 *
 * @param {NodeListOf<Element>} customSelects - The custom select elements.
 */
function updateSelectedOptionsForCustomSelects(customSelects: NodeListOf<Element>): void {
    customSelects.forEach(updateSelectedOptions);
}

/**
 * Setup all custom select elements.
 *
 * @param {NodeListOf<Element>} customSelects - The custom select elements.
 */
function setupCustomSelectElements(customSelects: NodeListOf<Element>): void {
    customSelects.forEach(setupCustomSelect);
}

/**
 * Add click event listeners to all options for custom select elements
 *
 * @param {NodeListOf<Element>} customSelects - The custom select elements.
 */
function addClickEventListenersToOptions(customSelects: NodeListOf<Element>): void {
    customSelects.forEach(addClickListenersToOptions);
}


/**
 * Add click event listener to the document for handling custom select elements and removing tags
 */
function addDocumentClickEventListener(): void {
    document.addEventListener("click", handleDocumentClick);
}


// Invoke the question detail page application entry point.
await setup();
