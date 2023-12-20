import {utils} from "@hboictcloud/api";

/**
 * Redirects to the question-detail page when an event row is clicked.
 *
 * @returns {Promise<void>} A Promise that resolves after the specified delay.
 * @param questionId
 */
export async function handleRedirectToQuestionDetail(questionId: number | null): Promise<void> {
    if (questionId) {
        const url: string = utils.createUrl("question.html", {
            questionId,
        });
        if (url) {
            window.location.href = url;
        }
    }
}

/**
 * Redirects the user to the specified URL using the `window.location.replace` method.
 * @param {string} target - The URL to which the user should be redirected.
 * @returns {void}
 */
export function redirect(target: string | any): void {
    // Use the window.location.replace method to perform the redirect.
    window.location.href = target;
}
