import {utils} from "@hboictcloud/api";

/**
 * Redirects to the question-detail page when an event row is clicked.
 *
 * @param {HTMLTableRowElement} row - The HTML row element representing the question to be shown
 * @returns {Promise<void>} A Promise that resolves after the specified delay.
 */
export async function handleRedirectToQuestionDetail(row: HTMLTableRowElement): Promise<void> {
    const id: string = row.getAttribute("id")!;

    if (id) {
        const url: string = utils.createUrl("single-question.html", {
            question: id,
        });
        if (url) {
            window.location.href = url;
        }
    }
}