import {url, utils} from "@hboictcloud/api";
import {PostType} from "../enum/postType";
import {AnswerWithUser} from "../models/interface/answerWithUser";
import {Answer} from "../models/answer";
import {CodingTag} from "../models/codingTag";
import {User} from "../models/user";

/**
 * Adds click event listeners to elements matching the given selector.
 *
 * @param {string} selector - The CSS selector for the elements.
 * @param {(item: Element) => Promise<void> | void} callback - The callback function to be executed on click.
 */
export function addEventListeners(selector: string, callback: (item: Element) => Promise<void> | void): void {
    document.querySelectorAll(selector).forEach(item => {
        item.addEventListener("click", async (): Promise<void> => {
            callback(item);
        });
    });
}

/**
 * Adds click event listeners to elements with the class "edit-button".
 */
export function addEditButtonListeners(): void {
    document.querySelectorAll(".edit-button").forEach(item => {
        item.addEventListener("click", async () => {
            // Create a new URL with the updated page number
            const newURL: string = utils.createUrl("edit-form.html", {
                postType: PostType.ANSWER,
                id: item.id
            });

            // Redirect to the new URL
            url.redirect(newURL);
        });
    });
}

/**
 * Adds click event listener for certifying an answer.
 *
 * @param {number} currentUserId - The ID of the current user.
 * @param {number} questionUserId - The ID of the user who posted the question.
 * @param {AnswerWithUser} answer - The answer to be certified.
 */
export function addCertifyClickListener(currentUserId: number, questionUserId: number, answer: AnswerWithUser): void {
    document.querySelector(".certified-answer-check")?.addEventListener("click", async (): Promise<void> => {
        if (currentUserId === questionUserId) {
            // Create a new instance of the answer
            const newAnswer: Answer = createNewAnswerInstance(answer);

            // Toggle the acceptance status and update the answer
            const updated: Answer = await newAnswer.toggleIsAcceptedAndUpdate() as Answer;
            if (updated) {
                // Reload the page after successful update
                location.reload();
            }
        }
    });
}

/**
 * Calculates the upvote count for a given answer.
 *
 * @param {AnswerWithUser} answer - The answer for which to calculate the upvote count.
 * @returns {number} - The calculated upvote count.
 */
export function getUpvoteCount(answer: AnswerWithUser): number {
    return (answer.totalUpvotes || 0) - (answer.totalDownvotes || 0);
}

/**
 * Gets the username for a given answer.
 *
 * @param {AnswerWithUser} answer - The answer for which to get the username.
 * @returns {string} - The username.
 */
export function getUsername(answer: AnswerWithUser): string {
    return answer.firstname + " " + answer.lastname as string;
}

/**
 * Gets the URL for the check mark icon based on the acceptance status of an answer.
 *
 * @param {boolean} isAccepted - The acceptance status of the answer.
 * @returns {string} - The URL for the check mark icon.
 */
export function getCheckMarkUrl(isAccepted: boolean): string {
    return isAccepted ? "assets/img/icons/check-badge-color.svg" : "assets/img/icons/check-badge.svg";
}

/**
 * Determines the visibility of the certification option based on user roles.
 *
 * @param {number} currentUserId - The ID of the current user.
 * @param {number} questionUserId - The ID of the user who posted the question.
 * @param {boolean} isAccepted - The acceptance status of the answer.
 * @returns {string} - The visibility class.
 */
export function getCertifyVisibility(currentUserId: number, questionUserId: number, isAccepted: boolean): string {
    return currentUserId !== questionUserId && !isAccepted ? "hidden" : "";
}

/**
 * Determines the extra class based on the current user and the answer user.
 *
 * @param {number} userId - The ID of the current user.
 * @param {number} answerUserId - The ID of the user who posted the answer.
 * @returns {string} - The extra class.
 */
export function getExtraClass(userId: number, answerUserId: number): string {
    return userId !== answerUserId ? "hidden" : "";
}

/**
 * Formats dates for display.
 *
 * @param {Date} createdAt - The creation date.
 * @param {Date} updatedAt - The update date.
 * @returns {{ createdAt: string; updatedAt: string }} - Formatted dates.
 */
export function formatDates(createdAt: Date, updatedAt: Date): { createdAt: string; updatedAt: string } {
    const theCreatedAtDate: Date = new Date(createdAt);
    const theUpdatedAtDate: Date = new Date(updatedAt);
    const createdDate: string = theCreatedAtDate.toISOString().slice(0, 10);
    const updatedDate: string = theUpdatedAtDate.toISOString().slice(0, 10);
    return {createdAt: createdDate, updatedAt: updatedDate};
}

/**
 * Retrieves user expertise based on user ID.
 *
 * @param {number} userId - The ID of the user.
 * @returns {Promise<string>} - A Promise that resolves to the user expertise.
 */
export async function getUserExpertise(userId: number): Promise<string> {
    const userExpertises: [CodingTag] = await User.getUserExpertises(userId) as [CodingTag];
    const tagNames: string[] = [...new Set(userExpertises.map(item => item.tagName))];
    return tagNames.length === 0 ? "No expertise!" : tagNames.join(", ");
}

/**
 * Creates a new instance of the Answer class.
 *
 * @param {AnswerWithUser} answer - The answer to create a new instance for.
 * @returns {Answer} - A new instance of the Answer class.
 */
export function createNewAnswerInstance(answer: AnswerWithUser): Answer {
    return new Answer(
        answer.answerId,
        answer.questionId,
        answer.userId,
        answer.answerBody,
        answer.totalUpvotes,
        answer.totalDownvotes,
        answer.isAccepted,
        answer.createdAt,
        answer.updatedAt
    );
}