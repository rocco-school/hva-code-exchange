import "./config";
import {Question} from "./models/question";
import {AnswerWithUser} from "./models/interface/answerWithUser";
import {User} from "./models/user";
import {JWTPayload} from "jose";
import {security} from "./components/security";
import {Answer} from "./models/answer";
import {showSuccessMessage} from "./components/successMessage";
import {VoteType} from "./enum/voteType";
import {handleAnswerUpvote, handleQuestionUpvote} from "./components/handleUpvotes";
import {PostType} from "./enum/postType";
import {handleAnswerDownvote, handleQuestionDownvote} from "./components/handleDownvotes";
import {initializeTextEditor} from "./components/initializeTextEditor";
import {CodingTag} from "./models/codingTag";
import {url, utils} from "@hboictcloud/api";
import {
    addCertifyClickListener,
    addEditButtonListeners,
    addEventListeners,
    formatDates,
    getCertifyVisibility,
    getCheckMarkUrl,
    getExtraClass,
    getUpvoteCount,
    getUserExpertise,
    getUsername
} from "./components/handleInitializeAnswers";

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

    // Check the user login status by calling the 'security' function.
    const loginStatus: JWTPayload | boolean = await security();

    // @ts-ignore: Extract user ID from login status
    const userId: number = loginStatus["userId"] as number;

    // Retrieves a question from the database based on the URL parameter question ID.
    const question: Question = await Question.retrieveQuestion(questionId) as Question;

    await generateQuestionUserInfo(userId, question);

    // If the question does not exist, redirect to the index page
    if (!question) location.replace("index.html");

    // Initialize the text editor.
    await initializeTextEditor();

    // Calculate the upvote count for the question
    const upvoteSum: number = question.totalUpvotes! - question.totalDownvotes!;
    (<HTMLInputElement>document.querySelector(".upvote-count")).innerHTML = upvoteSum.toString();
    (<HTMLInputElement>document.querySelector(".question-title")).innerHTML = <string>question?.questionTitle;
    (<HTMLInputElement>document.querySelector(".question-body")).innerHTML = <string>question?.questionBody;

    if (userId === question.userId) {
        (<HTMLButtonElement>document.querySelector(".question-edit")).classList.remove("hidden");
        (<HTMLButtonElement>document.querySelector(".question-divider")).classList.remove("hidden");
    }

    // Populate all answers by questionID
    await addAnswersToPage(userId);

    // Add event listeners for upvoting and downvoting the question
    (<HTMLElement>document.querySelector(".upvote-question")).addEventListener("click", async (): Promise<void> => {
        await handleVoting(question.questionId!, userId, PostType.QUESTION, VoteType.UPVOTE);
    });

    (<HTMLElement>document.querySelector(".downvote-question")).addEventListener("click", async (): Promise<void> => {
        await handleVoting(question.questionId!, userId, PostType.QUESTION, VoteType.DOWNVOTE);
    });

    // Add event listeners for delete buttons in each answer
    (<NodeListOf<Element>>document.querySelectorAll(".delete-button")).forEach(item => {
        item.addEventListener("click", async (): Promise<void> => {
            await showSuccessMessage("Are you sure you want to delete this Answer?", null, "delete", parseInt(item.id), "answer");
        });
    });

    (<HTMLDivElement>document.querySelector(".edit-button")).addEventListener("click", async (): Promise<void> => {
        // Create a new URL with the updated page number
        const newURL: string = utils.createUrl("edit-form.html", {
            postType: PostType.QUESTION,
            id: questionId
        });

        url.redirect(newURL);
    });

    // Add event listener for continuing the delete operation
    (<HTMLElement>document.querySelector(".continue-button")).addEventListener("click", async (item) => {
        const target: HTMLDivElement = item.target as HTMLDivElement;

        // Check if the target has the correct class
        if (!target.classList.contains("answer")) {
            await showSuccessMessage("Error while deleting answer!", 3000, "danger", null, null);
            return;
        }

        // Delete the answer and show success/error messages accordingly
        const deleteAnswer: boolean | string = await Answer.deleteAnswer(parseInt(target.id));

        if (deleteAnswer === true) {
            await showSuccessMessage("Successfully deleted Answer", 3000, "success", null, null);
            location.reload();
        } else {
            await showSuccessMessage("Error while deleting answer!", 3000, "danger", null, null);
            return;
        }
    });

    // Get references to the new answer submission button and the text input area
    const postNewAnswer: HTMLButtonElement = (<HTMLButtonElement>document.querySelector(".btn_submit"));
    const newAnswerTextBody: HTMLDivElement = (<HTMLDivElement>document.querySelector("#text-input"));

    // Add event listener for posting a new answer
    postNewAnswer.addEventListener("click", async (): Promise<void> => {
        // Check if the user is logged in
        if (!loginStatus) {
            await showSuccessMessage("Please login before creating an answer for this question!", 5000, "danger", null, null);
            return;
        }

        // Check if the answer body is not empty
        if (!newAnswerTextBody.innerHTML) {
            await showSuccessMessage("Please enter your answer before posting answer", 3000, "danger", null, null);
            return;
        }

        // Create a new Answer object
        const newAnswer: Answer = new Answer(
            null,
            questionId,
            userId,
            newAnswerTextBody.innerHTML,
            null,
            null,
            false,
            null,
            null
        );

        try {
            // Save the new answer and show success message
            const savedAnswer: Answer | string = await newAnswer.saveAnswer();
            console.log("Answer saved successfully:", savedAnswer);

            await showSuccessMessage("Successfully created answer!", 3000, "success", null, null);
            location.reload();
        } catch (error) {
            // Show error message if there's an issue saving the answer
            await showSuccessMessage("Failed to create answer!", 3000, "danger", null, null);
            console.error("Failed to save answer:", error);
        }
    });
}

// Invoke the question detail page application entry point.
await setup();


/**
 * Generates and displays user information for a given user ID within a question.
 *
 * @param {string} userId - The ID of the user for whom the information is generated.
 * @param {Question} question - The Question Object with whom the information is generated.
 * @returns {Promise<void>} A Promise that resolves when the function completes successfully.
 */
async function generateQuestionUserInfo(userId: number, question: Question): Promise<void> {
    const user: User = await User.retrieveUser(userId) as User;

    // Get total answers and total questions count for the user
    let totalAnswers: number = await User.getTotalAnswers(user.userId) as number;
    let totalQuestions: number | string = await User.getTotalQuestions(user.userId) as number;
    const username: string = user.firstname + " " + user.lastname as string;

    // Retrieve user expertises, which are coding tags associated with the user
    let userExpertises: [CodingTag] = await User.getUserExpertises(user.userId) as [CodingTag];

    // Extract unique tag names from user expertises
    const tagNames: string[] = [...new Set(userExpertises.map((item: { tagName: any; }) => item.tagName))];
    let userExpertise: string = tagNames.join(", ");

    // Check if the user has no expertise and update the userExpertise accordingly
    if (tagNames.length === 0) {
        userExpertise = "No expertise!";
    }

    // Format the creation date of the answer
    const createdAt: Date = question.createdAt as Date;
    const updatedAt: Date = question.updatedAt as Date;

    const theCreatedAtDate: Date = new Date(createdAt);
    const theUpdatedAtDate: Date = new Date(updatedAt);
    const createdDate: string = theCreatedAtDate.toISOString().slice(0, 10);
    const updatedDate: string = theUpdatedAtDate.toISOString().slice(0, 10);


    const AvatarUrl: string = user.profilePicture ? user.profilePicture : `https://ui-avatars.com/api/?name=${user.firstname}+${user.lastname}&background=random`;

    /**
     * Represents user information displayed in a question.
     * @type {string}
     */
    const questionUser: string = createQuestionPerson(
        createdDate,
        updatedDate,
        AvatarUrl,
        username,
        totalAnswers.toString(),
        totalQuestions.toString(),
        userExpertise,
    );

    if (questionUser) {
        (<HTMLDivElement>document.querySelector(".question-info")).innerHTML += questionUser;
    }
}


/**
 * Handles voting on a post (either question or answer).
 * @param postId - The ID of the post.
 * @param userId - The ID of the user who is voting.
 * @param postType - The type of the post (either 'question' or 'answer').
 * @param votingType - The type of voting (either 'upvote' or 'downvote').
 * @returns A Promise that resolves when the voting is handled.
 * @throws Error if there is an issue handling the vote.
 */
async function handleVoting(postId: number, userId: number, postType: string, votingType: string): Promise<void> {
    if (postType === PostType.QUESTION || postType === PostType.ANSWER) {
        if (votingType === VoteType.UPVOTE) {
            await handleUpvote(postId, userId, postType);
        } else if (votingType === VoteType.DOWNVOTE) {
            await handleDownvote(postId, userId, postType);
        } else {
            throw new Error("Invalid voting type!");
        }
    } else {
        throw new Error("Invalid post type!");
    }
}


/**
 * Handles upvoting on a post.
 * @param postId - The ID of the post.
 * @param userId - The ID of the user who is upvoting.
 * @param postType - The type of the post (either 'question' or 'answer').
 * @returns A Promise that resolves when the upvote is handled.
 */
async function handleUpvote(postId: number, userId: number, postType: string): Promise<void> {
    if (postType === PostType.QUESTION) {
        await handleQuestionUpvote(postId, userId);
    } else if (postType === PostType.ANSWER) {
        await handleAnswerUpvote(postId, userId);
    }
}

/**
 * Handles downvoting on a post.
 * @param postId - The ID of the post.
 * @param userId - The ID of the user who is downvoting.
 * @param postType - The type of the post (either 'question' or 'answer').
 * @returns A Promise that resolves when the downvote is handled.
 */
async function handleDownvote(postId: number, userId: number, postType: string): Promise<void> {
    if (postType === PostType.QUESTION) {
        await handleQuestionDownvote(postId, userId);
    } else if (postType === PostType.ANSWER) {
        await handleAnswerDownvote(postId, userId);
    }
}


/**
 * Creates HTML markup for displaying an answer.
 *
 * @param {number} answerId - The unique identifier for the answer.
 * @param {string} answerText - The text content of the answer.
 * @param {string} upvoteCount - The count of upvotes for the answer.
 * @param {string} createdAt - The creation timestamp of the answer.
 * @param {string} updatedAt - The updated timestamp of the answer.
 * @param {string} profilePictureSrc - The source URL for the user's profile picture.
 * @param {string} username - The username of the user who posted the answer.
 * @param {number} answersCount - The total count of answers posted by the user.
 * @param {number} questionsCount - The total count of questions posted by the user.
 * @param {string} userExpertise - The expertise of the user that posted this answer
 * @param {string} extraClass - Additional CSS class to be applied to action buttons.
 * @param {string} certifiedPictureSrc - The source URL for the current certified check mark picture.
 * @param {string} canUserCertify - Additional CSS class to be applied when user can not certify answers.
 * @returns {string} - HTML markup for the answer.
 */
function createAnswerElement(
    answerId: number,
    answerText: string,
    upvoteCount: string,
    createdAt: string,
    updatedAt: string,
    profilePictureSrc: string,
    username: string,
    answersCount: number,
    questionsCount: number,
    userExpertise: string,
    extraClass: string,
    certifiedPictureSrc: string,
    canUserCertify: string,
): string {
    return `
        <div class="answer">
            <div class="answer-container">
                <div class="answer-sidebar">
                    <div id="${answerId}" class="vote">
                        <!-- Upvote button and count -->
                        <img class="arrow answer-upvote" alt="upvote answer" src="assets/img/icons/arrow-up.svg">
                        <span class="upvote-count">${upvoteCount}</span>
                        <!-- Downvote button -->
                        <img class="arrow arrow-down answer-downvote" alt="upvote answer" src="assets/img/icons/arrow-up.svg">
                    </div>
                    <div class="certified-answer-check ${canUserCertify}">
                        <img class="certified-answer" alt="Certified answer" src="${certifiedPictureSrc}">
                    </div>
                </div>
                <div class="answer-body">
                    <!-- Answer text -->
                    <span>${answerText}</span>
                    
                    <div class="answer-info">
                        <div class="action-buttons ${extraClass}">
                            <!-- Delete/edit button with unique ID -->
                            <button class="button edit-button" id="${answerId}">Edit</button>
                            <button class="button delete-button" id="${answerId}">Delete</button>
                        </div>
                        
                        <div class="created-info">
                            <div class="inner-info">
                                <!-- Creation timestamp -->
                                <div class="answer-date">
                                    <span>Created at: ${createdAt}</span>
                                    <span>Last updated: ${updatedAt}</span>
                                </div>
                                <div class="person">
                                    <!-- User profile picture -->
                                    <img class="profile-picture" alt="profile picture" src="${profilePictureSrc}">
                                    <div class="personal-information">
                                        <!-- User details -->
                                        <span>${username}</span>
                                        <span>Answers: ${answersCount}</span>
                                        <span>Questions: ${questionsCount}</span>
                                        <button id="tooltipButton" type="button" class="tool-tip-button">Expertise</button>
                                        <div id="tooltipContent" role="tooltip" class="tool-tip-content">${userExpertise}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}


/**
 * Creates HTML markup for displaying an answer.
 *
 * @param {string} createdAt - The creation timestamp of the answer.
 * @param {string} updatedAt - The updated timestamp of the answer.
 * @param {string} profilePictureSrc - The source URL for the user's profile picture.
 * @param {string} username - The username of the user who posted the answer.
 * @param {string} userAnswerCount - The total count of answers posted by the user.
 * @param {string} userQuestionCount - The total count of question posted by the user.
 * @param {string} userExpertise - The expertise of the user that posted this answer
 * @returns {string} - HTML markup for the answer.
 */
function createQuestionPerson(
    createdAt: string,
    updatedAt: string,
    profilePictureSrc: string,
    username: string,
    userAnswerCount: string,
    userQuestionCount: string,
    userExpertise: string,
): string {
    return `
        <div class="created-info question-person-info">
            <div class="inner-info">
                <!-- Creation timestamp -->
                <div class="answer-date">
                    <span>Created at: ${createdAt}</span>
                    <span>Last updated: ${updatedAt}</span>
                </div>
                <div class="person">
                    <!-- User profile picture -->
                    <img class="profile-picture" alt="profile picture" src="${profilePictureSrc}">
                    <div class="personal-information">
                        <!-- User details -->
                        <span>${username}</span>
                        <span>Answers: ${userAnswerCount}</span>
                        <span>Questions: ${userQuestionCount}</span>
                        <button id="tooltipButton" type="button" class="tool-tip-button">Expertise</button>
                        <div id="tooltipContent" role="tooltip" class="tool-tip-content">${userExpertise}</div>
                    </div>
                </div>
            </div>
        </div>`;
}


/**
 * Adds answers to the page for a specific question.
 *
 * @param {number} userId - The unique identifier for the current user.
 * @returns {Promise<void>} - A Promise that resolves when answers are successfully added to the page.
 */
async function addAnswersToPage(userId: number): Promise<void> {
    const answersBody: HTMLDivElement = document.querySelector(".answers") as HTMLDivElement;
    const answerCount: HTMLDivElement = document.querySelector(".answer-count") as HTMLDivElement;

    const answers: [AnswerWithUser] = await Question.getAnswersForQuestion(questionId) as [AnswerWithUser];
    const loginStatus: boolean | JWTPayload = await security();
    // @ts-ignore
    const currentUserId: number = loginStatus["userId"] as number;

    const question: Question = await Question.retrieveQuestion(questionId) as Question;
    answerCount.innerHTML = String(answers.length);

    // Check if there are any answers to display
    for (const singleAnswer of answers) {
        const answer: AnswerWithUser = singleAnswer as AnswerWithUser;
        const totalAnswers: number = await User.getTotalAnswers(answer.userId) as number;
        const totalQuestions: number = await User.getTotalQuestions(answer.userId) as number;
        const userExpertise: string = await getUserExpertise(answer.userId);

        const {createdAt, updatedAt} = formatDates(answer.createdAt as Date, answer.updatedAt as Date);

        const extraClass: string = getExtraClass(userId, answer.userId);
        const canUserCertify: string = getCertifyVisibility(currentUserId, question.userId, answer.isAccepted);
        const checkMarkUrl: string = getCheckMarkUrl(answer.isAccepted);

        const username: string = getUsername(answer);
        const upvoteCount: number = getUpvoteCount(answer);

        const AvatarUrl: string = answer.profilePicture ? answer.profilePicture : `https://ui-avatars.com/api/?name=${answer.firstname}+${answer.lastname}&background=random`;

        const answerElement: string = createAnswerElement(
            answer.answerId!,
            answer.answerBody,
            upvoteCount.toString(),
            createdAt,
            updatedAt,
            AvatarUrl,
            username,
            totalAnswers,
            totalQuestions,
            userExpertise,
            extraClass,
            checkMarkUrl,
            canUserCertify
        );

        answersBody.innerHTML += answerElement;

        addCertifyClickListener(currentUserId, question.userId, answer);
    }

    addEventListeners(".answer-upvote", async (item: Element) => {
        const answerId: string = item.parentElement?.id as string;
        answerId && await handleVoting(parseInt(answerId), userId, PostType.ANSWER, VoteType.UPVOTE);
    });

    addEventListeners(".answer-downvote", async (item: Element) => {
        const answerId: string = item.parentElement?.id as string;
        answerId && await handleVoting(parseInt(answerId), userId, PostType.ANSWER, VoteType.DOWNVOTE);
    });

    addEditButtonListeners();
}


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
        const checkedParam: string | null = params.get("questionId");

        if (checkedParam) {
            // Set the global "questionId" variable to the retrieved value.
            questionId = checkedParam;
        }
    } catch (e) {
        console.log(e);
    }
}