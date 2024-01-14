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