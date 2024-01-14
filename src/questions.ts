import "./config";
import {api, url, utils} from "@hboictcloud/api";
import {QUESTION_QUERY} from "./query/question.query";
import {handleRedirectToQuestionDetail} from "./components/handleRedirects";
import {Question} from "./models/question";
import {Answer} from "./models/answer";

/**
 * The main application entry point for the home page.
 *
 * This function initializes the home page, including event handling,
 * user verification, and other related functionality.
 *
 * @returns {Promise<void>} A Promise that resolves when the application setup is complete.
 */
async function setup(): Promise<void> {
    // Get max number of pages for loading all questions.
    const getMaxPages: number | string = await Question.getMaxQuestionPages();
    const pageNumbers: number[] = [...Array(getMaxPages).keys()].map(i => i + 1);

    // populate question table.
    await populateQuestionTable();

    // Add pagination page numbers
    await addPagination(pageNumbers);

    // Get all create question form elements.
    const createQuestion: HTMLButtonElement = (<HTMLButtonElement>document.querySelector(".create-question"));

    const createQuestionForm: HTMLButtonElement = (<HTMLButtonElement>document.querySelector(".create-question"));
    const questionForm: HTMLButtonElement = (<HTMLButtonElement>document.querySelector(".question-form"));
    const cancelForm: HTMLButtonElement = (<HTMLButtonElement>document.querySelector(".cancel-create-question"));
    const nextButton: HTMLButtonElement = (<HTMLButtonElement>document.querySelector(".next-icon"));
    const prevButton: HTMLButtonElement = (<HTMLButtonElement>document.querySelector(".prev-icon"));
    const firstPageButton: HTMLButtonElement = (<HTMLButtonElement>document.querySelector(".prev-all-icon"));
    const lastPageButton: HTMLButtonElement = (<HTMLButtonElement>document.querySelector(".next-all-icon"));
    const allPages: NodeListOf<HTMLSpanElement> = (<NodeListOf<HTMLSpanElement>>document.querySelectorAll(".page"));


    // Pagination pages navigation
    allPages.forEach(item => {
        item.addEventListener("click", (): void => {
            const pageNumber: string = item.textContent as string;

            // Create a new URL with the updated page number
            const newURL: string = utils.createUrl("questions.html", {
                page: parseInt(pageNumber)
            });

            // Update the current URL with the new URL
            window.history.pushState({path: newURL}, "", newURL);

            // Reload the page
            location.reload();
        });
    });

    // Pagination Navigation: Show next set of questions when the "Next" button is clicked
    nextButton?.addEventListener("click", (): void => {
        // Get the current page number from the query string
        let pageNumber: string = url.getFromQueryString("page");

        // Set default values for the current page and the new page number
        let currentPage: number = 1;
        let newPageNumber: number = parseInt(pageNumber) ? parseInt(pageNumber) + 1 : 2;

        // Check if the newPageNumber is within the valid range
        if (pageNumbers.includes(newPageNumber) && newPageNumber >= 1) {
            // Set the currentPage variable to the valid newPageNumber
            currentPage = newPageNumber;

            // Create a new URL with the updated page number
            const newURL: string = utils.createUrl("questions.html", {
                page: currentPage
            });

            // Update the current URL with the new URL
            window.history.pushState({path: newURL}, "", newURL);

            // Reload the page to show the next set of questions
            location.reload();
        }
    });

    // Pagination Navigation: Show previous set of questions when the "Previous" button is clicked
    prevButton?.addEventListener("click", (): void => {
        // Get the current page number from the query string
        let pageNumber: string = url.getFromQueryString("page");

        // Set default values for the current page and the new page number
        let currentPage: number = 1;
        let newPageNumber: number = parseInt(pageNumber) ? parseInt(pageNumber) - 1 : 1;

        // Check if the newPageNumber is included in the valid page numbers
        if (pageNumbers.includes(newPageNumber) && newPageNumber >= 1) {
            // Set the currentPage variable to the valid newPageNumber
            currentPage = newPageNumber;

            // Create a new URL with the updated page number
            const newURL: string = utils.createUrl("questions.html", {
                page: currentPage
            });

            // Update the current URL with the new URL
            window.history.pushState({path: newURL}, "", newURL);

            // Reload the page to show the previous set of questions
            location.reload();
        }
    });

    // Pagination Navigation: Show first set of questions when the "First Page" button is clicked
    firstPageButton?.addEventListener("click", (): void => {
        // Set default values for the current page and the new page number
        const firstPage: number = pageNumbers[0];

        // Create a new URL with the updated page number
        const newURL: string = utils.createUrl("questions.html", {
            page: firstPage
        });

        // Update the current URL with the new URL
        window.history.pushState({path: newURL}, "", newURL);

        // Reload the page to show the first set of questions
        location.reload();
    });

    // Pagination Navigation: Show last set of questions when the "Last Page" button is clicked
    lastPageButton?.addEventListener("click", (): void => {
        // Set default values for the current page and the new page number
        const lastPage: number = pageNumbers[pageNumbers.length - 1];

        // Create a new URL with the updated page number
        const newURL: string = utils.createUrl("questions.html", {
            page: lastPage
        });

        // Update the current URL with the new URL
        window.history.pushState({path: newURL}, "", newURL);

        // Reload the page to show the last set of questions
        location.reload();
    });


    // Show question form on click
    createQuestion?.addEventListener("click", (): void => {
        url.redirect("create-question.html");
    });

    // Cancel creating question on click
    cancelForm?.addEventListener("click", (): void => {
        if (createQuestionForm) {
            createQuestionForm.classList.add("hidden");
        }
    });

    /**
     * Event listener for the create event form submission.
     * @param {Event} e - The event object representing the form submission.
     * @returns {Promise<void>} - A Promise that resolves when the function completes.
     */
    questionForm?.addEventListener("submit", async function (e): Promise<void> {
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
 * Add page numbers to the pagination element based on the current page and available page numbers.
 *
 * @param {number[]} pageArray - An array of available page numbers.
 * @returns {Promise<void>} - A promise that resolves once the page numbers are added to the DOM.
 */
async function addPagination(pageArray: number[]): Promise<void> {
    // Get the pagination element from the DOM
    const paginationElem: HTMLDivElement = document.querySelector(".pages") as HTMLDivElement;

    // Determine the current page based on the query string or default to 1
    const currentPage: number = url.getFromQueryString("page") ?? 1;

    // Get an array of page numbers to display based on the current page
    const displayPages: number[] = displayNumbers(currentPage, pageArray);

    // Iterate through the displayPages array and add page numbers to the DOM
    for (const displayPage of displayPages) {
        // Convert page numbers to strings for comparison
        const pageNumberStr: string = displayPage.toString();
        const currentNumberStr: string = currentPage.toString();

        // Check if the page number is the current page and apply appropriate styling
        if (pageNumberStr === currentNumberStr) {
            paginationElem.innerHTML += `<span class="page current">${displayPage}</span>`;
        } else {
            paginationElem.innerHTML += `<span class="page">${displayPage}</span>`;
        }
    }
}


/**
 * Get a subset of page numbers to display based on the current page.
 *
 * @param {number} page - The current page number.
 * @param {number[]} array - An array of available numbers.
 * @returns {number[]} - An array of numbers to display on the current page.
 */
function displayNumbers(page: number, array: number[]): number[] {
    // Assuming each page displays 3 numbers
    const numbersPerPage: number = 3;

    // Calculate start index, ensuring it's not less than 0
    const startIndex: number = Math.max(page - 2, 0);

    // Calculate end index, ensuring it's not greater than the array length
    const endIndex: number = Math.min(startIndex + numbersPerPage, array.length);

    // Extract the subset of numbers to display
    return array.slice(startIndex, endIndex);
}


/**
 * Asynchronously retrieves all questions from the database and renders them in the UI.
 *
 * @returns {Promise<void>} - A Promise that resolves when the function completes.
 */
async function populateQuestionTable(): Promise<void> {
    try {
        // Get the current page number from the query string or default to 1
        const pageNumber: number = url.getFromQueryString("page") ?? 1;

        // Calculate the offset for database query based on the page number
        const queryOffset: number = (pageNumber - 1) * 10;

        // Querying the database to get questions within the specified offset
        const questions: [Question] = await api.queryDatabase(QUESTION_QUERY.GET_QUESTION_BY_PAGE_NUMBER, queryOffset) as [Question];

        // Get the container element for rendering questions
        const questionsBody: HTMLButtonElement = document.querySelector(".questions-body") as HTMLButtonElement;

        // If there are no questions, return early
        if (!questions) return;

        // Iterating over each question and rendering it in the UI
        for (const question of questions) {
            // Create a Question instance for easier access to properties
            const singleQuestion: Question = new Question(
                question.questionId,
                question.userId,
                question.questionTitle,
                question.questionBody,
                question.isClosed,
                question.totalUpvotes,
                question.totalDownvotes,
                question.createdAt,
                question.updatedAt
            );

            const answers: string | Answer[] = await Answer.getAnswersByQuestionId(singleQuestion.questionId!);

            // Create a new table row for each question
            const tr: HTMLTableRowElement = questionsBody?.appendChild(document.createElement("tr"));

            if (tr) {
                // Set attributes for the table row
                tr.setAttribute("id", String(singleQuestion.questionId));
                tr.classList.add("question", "pointer"); // Combine multiple class attributes

                // Create a table cell for the question details
                const td: HTMLTableCellElement = tr.appendChild(document.createElement("td"));

                // Create a container to hold question details
                const container: HTMLDivElement = td.appendChild(document.createElement("div"));
                container.classList.add("d-flex");

                // Create a div to display the answer count
                const count: HTMLDivElement = container.appendChild(document.createElement("div"));
                count.classList.add("answer-count");

                // Create a span to display the actual answer count
                const countSpan: HTMLSpanElement = count.appendChild(document.createElement("span"));
                countSpan.innerHTML = "Answers: " + answers.length; // Replace with actual count

                // Create a div for the question body
                const questionBody: HTMLDivElement = container.appendChild(document.createElement("div"));

                // Create a div for the question title
                const questionTitle: HTMLDivElement = questionBody.appendChild(document.createElement("div"));
                questionTitle.classList.add("mb-2", "text-primary");

                // Populate the question title
                if (questionTitle) {
                    questionTitle.innerHTML = singleQuestion.questionTitle;
                }

                // Add a click event listener to redirect to the question detail page
                tr.addEventListener("click", (): void => {
                    handleRedirectToQuestionDetail(question.questionId);
                });
            }
        }
    } catch (e) {
        // Handle any errors that occur during the process
        console.error("Error in populateQuestionTable:", e);
    }
}