import "./config";
import {api, url} from "@hboictcloud/api";
import {QUESTION_QUERY} from "./query/question.query";
import {handleRedirectToQuestionDetail} from "./components/handleRedirects";
import {Question} from "./models/question";

/**
 * The main application entry point for the home page.
 *
 * This function initializes the home page, including event handling,
 * user verification, and other related functionality.
 *
 * @returns {Promise<void>} A Promise that resolves when the application setup is complete.
 */
async function setup(): Promise<void> {
    // populate question table.
    await populateQuestionTable();

    // Get all create question form elements.
    const createQuestion: HTMLButtonElement = (<HTMLButtonElement>document.querySelector(".create-question"));

    const createQuestionForm: HTMLButtonElement = (<HTMLButtonElement>document.querySelector(".create-question"));
    const questionForm: HTMLButtonElement = (<HTMLButtonElement>document.querySelector(".question-form"));
    const cancelForm: HTMLButtonElement = (<HTMLButtonElement>document.querySelector(".cancel-create-question"));


    // Show question form on click
    createQuestion.addEventListener("click", (): void => {
        url.redirect("create-question.html");
    });


    // Cancel creating question on click
    cancelForm.addEventListener("click", (): void => {
        if (createQuestionForm) {
            createQuestionForm.classList.add("hidden");
        }

    });

    /**
     * Event listener for the create event form submission.
     * @param {Event} e - The event object representing the form submission.
     * @returns {Promise<void>} - A Promise that resolves when the function completes.
     */
    questionForm.addEventListener("submit", async function (e): Promise<void> {
        e.preventDefault();

        const questionTitle: HTMLButtonElement = (<HTMLButtonElement>document.getElementById("questionTitle"));
        // const questionSelect: HTMLButtonElement = (<HTMLButtonElement>document.querySelector(".question-select"));
        const question: HTMLButtonElement = (<HTMLButtonElement>document.getElementById("question"));

        try {
            // Creating a new Question object with the provided values.
            const data: any[] = [94, questionTitle.value, question.value, false];

            // Querying the database with the new question data.
            const questionQuery: any = await api.queryDatabase(QUESTION_QUERY.CREATE_QUESTION, ...data);

            // Checking if the database query was successful.
            if (questionQuery) {
                // Hiding the createQuestionForm and refreshing the page.
                createQuestionForm.classList.add("hidden");
                location.reload();
            }
        } catch (e) {
            // Handling any errors that occur during the process.
            console.error(e);
        }
    });
}

// Invoke the homepage application entry point.
await setup();

/**
 * Asynchronously retrieves all questions from the database and renders them in the UI.
 * @returns {Promise<void>} - A Promise that resolves when the function completes.
 */
async function populateQuestionTable(): Promise<void> {
    try {
        // Querying the database to get all questions.

        const questions: [Question] = await api.queryDatabase(QUESTION_QUERY.SELECT_QUESTIONS) as [Question];

        console.log(questions);

        const questionsBody: HTMLButtonElement = (<HTMLButtonElement>document.querySelector(".questions-body"));

        // If there are no questions, return early.
        if (!questions) return;

        // Iterating over each question and rendering it in the UI.
        questions.forEach((question): void => {
            const singleQuestion: Question = new Question(
                question.questionId,
                question.userId,
                question.questionTitle,
                question.questionBody,
                question.isClosed,
                question.createdAt,
                question.updatedAt
            );

            // Creating a new table row for each question.
            const tr: HTMLTableRowElement = questionsBody?.appendChild(document.createElement("tr"));

            if (tr) {
                // Setting attributes for the table row.
                tr.setAttribute("id", String(singleQuestion.questionId));
                tr.classList.add("question", "pointer"); // Combining multiple class attributes.

                // Creating a table cell for the question details.
                const td: HTMLTableCellElement = tr.appendChild(document.createElement("td"));

                // Creating a container to hold question details.
                const container: HTMLDivElement = td.appendChild(document.createElement("div"));
                container.classList.add("d-flex");

                // Creating a div to display the answer count.
                const count: HTMLDivElement = container.appendChild(document.createElement("div"));
                count.classList.add("answer-count");

                // Creating a span to display the actual answer count (TODO: replace with actual count).
                const countSpan: HTMLSpanElement = count.appendChild(document.createElement("span"));
                countSpan.innerHTML = "Answers: 10";

                // Creating a div for the question body.
                const questionBody: HTMLDivElement = container.appendChild(document.createElement("div"));

                // Creating a div for the question title.
                const questionTitle: HTMLDivElement = questionBody.appendChild(document.createElement("div"));
                questionTitle.classList.add("mb-2", "text-primary");

                // Populating the question title.
                if (questionTitle) {
                    questionTitle.innerHTML = singleQuestion.questionTitle;
                }

                // Creating a div for the question text.
                const questionText: HTMLDivElement = questionBody.appendChild(document.createElement("div"));

                // Populating the question text.
                if (questionText) {
                    questionText.innerHTML = singleQuestion.questionBody.substring(0, 100) + "...";
                }

                // Adding a click event listener to redirect to the question detail page.
                tr.addEventListener("click", (): void => {
                    handleRedirectToQuestionDetail(question.questionId);
                });
            }
        });

    } catch (e) {
        // Handling any errors that occur during the process.
        console.error(e);
    }
}