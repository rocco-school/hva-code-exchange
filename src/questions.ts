import "./config";
import {api, url, utils} from "@hboictcloud/api";
import {QUESTION_QUERY} from "./query/question.query";
import {Question} from "./models/question";
import {User} from "./models/user";
import {CodingTag} from "./models/codingTag";
import {createNewQuestionInstance} from "./components/handleModelInstances";
import DOMPurify from "dompurify";
import {handleRedirectToQuestionDetail} from "./components/handleRedirects";
import {delay} from "./components/delay";
import {createQuestionElement} from "./components/htmlTemplate";
import {removeHTMLTagsAndExtraWhitespace} from "./components/filterHTML";

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

    // Add pagination page numbers
    await addPagination();

    await populatePaginationResult();

    // Get all create question form elements.
    const createQuestionForm: HTMLButtonElement = (<HTMLButtonElement>document.querySelector(".create-question"));
    const questionForm: HTMLButtonElement = (<HTMLButtonElement>document.querySelector(".question-form"));
    const cancelForm: HTMLButtonElement = (<HTMLButtonElement>document.querySelector(".cancel-create-question"));
    const allPages: NodeListOf<HTMLSpanElement> = (<NodeListOf<HTMLSpanElement>>document.querySelectorAll(".page"));
    const createButton: HTMLButtonElement = (<HTMLButtonElement>document.querySelector(".createQuestionButton"));

    const itemsPerPageSelector: HTMLSelectElement = (<HTMLSelectElement>document.querySelector(".questionAmount"));


    createButton.addEventListener("click", async (): Promise<void> => {
        createButton.classList.add("createButtonFocus");
        await delay(100);
        createButton.classList.remove("createButtonFocus");

        url.redirect("create-question.html");
    });


    itemsPerPageSelector.addEventListener("change", () => {
        const selectedItemsPerPage: number = itemsPerPageSelector.selectedIndex + 1;
        const paramName: string = "itemsPerPage";

        // Get the current URL
        const currentUrl: string = window.location.href;

        // Check if the URL already has a query string
        const hasQueryString: boolean = currentUrl.includes("?");


        // Create a regular expression to match the parameter
        const paramRegex: RegExp = new RegExp(`([?&])${paramName}=([^&]*)`, "i");

        // Check if the parameter already exists in the URL
        const paramExists: boolean = paramRegex.test(currentUrl);

        // Update or add the parameter
        let newUrl: string;
        if (paramExists) {
            // If the parameter exists, update its value
            newUrl = currentUrl.replace(paramRegex, `$1${paramName}=${selectedItemsPerPage}`);
        } else {
            // If the parameter doesn't exist, add it
            const separator: string = hasQueryString ? "&" : "?";
            newUrl = `${currentUrl}${separator}${paramName}=${selectedItemsPerPage}`;
        }

        // Redirect to the new URL
        window.location.href = newUrl;
    });


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

// Invoke the questions application entry point.
await setup();

function mapNumberToPaginationValue(num: number): number | "ALL" {
    switch (num) {
        case 1:
            return 10;
        case 2:
            return 20;
        case 3:
            return 40;
        case 4:
            return 50;
        case 5:
            return "ALL";
        default:
            throw new Error("Invalid number for pagination");
    }
}


/**
 * Add page numbers to the pagination element based on the current page and available page numbers.
 *
 * @returns {Promise<void>} - A promise that resolves once the page numbers are added to the DOM.
 */
async function addPagination(): Promise<void> {
    const getParam: number = url.getFromQueryString("itemsPerPage") ?? 1;
    const currentPage: number = url.getFromQueryString("page") ?? 1;

    const pagination: HTMLDivElement = (<HTMLDivElement>document.querySelector(".paginator"));
    const selectedItemsPerPage: HTMLSelectElement = (<HTMLSelectElement>document.querySelector(".questionAmount"));

    selectedItemsPerPage.value = getParam.toString();

    const itemsPerPage: number | string = mapNumberToPaginationValue(parseInt(String(getParam)));
    if (itemsPerPage !== "ALL") {
        pagination.classList.remove("hidden");
    }

    const items: number = itemsPerPage as number;
    const getMaxPages: number | string = await Question.getMaxQuestionPages(items);
    const pageArray: number[] = [...Array(getMaxPages).keys()].map(i => i + 1);
    // Get an array of page numbers to display based on the current page
    const displayPages: number[] = displayNumbers(currentPage, pageArray);

    const lastPage: number = pageArray[pageArray.length - 1];

    // Get the pagination element from the DOM
    const paginationElem: HTMLDivElement = document.querySelector(".pages") as HTMLDivElement;

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

    // Add ellipsis if the last page is not visible
    if (displayPages[displayPages.length - 1] < lastPage - 1) {
        paginationElem.innerHTML += "<span class='suppressed-pages'>...</span>";
        paginationElem.innerHTML += `<span class="page">${lastPage}</span>`;
    }

    const nextButton: HTMLButtonElement = (<HTMLButtonElement>document.querySelector(".next-icon"));
    const prevButton: HTMLButtonElement = (<HTMLButtonElement>document.querySelector(".prev-icon"));


    // Pagination Navigation: Show next set of questions when the "Next" button is clicked
    nextButton?.addEventListener("click", (): void => {
        // Get the current page number from the query string
        let pageNumber: string = url.getFromQueryString("page");

        // Set default values for the current page and the new page number
        let currentPage: number = 1;
        let newPageNumber: number = parseInt(pageNumber) ? parseInt(pageNumber) + 1 : 2;

        // Check if the newPageNumber is within the valid range
        if (pageArray.includes(newPageNumber) && newPageNumber >= 1) {
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
        if (pageArray.includes(newPageNumber) && newPageNumber >= 1) {
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

async function populatePaginationResult(): Promise<void> {
    const currentPageRange: HTMLButtonElement = (<HTMLButtonElement>document.querySelector(".currentPageRange"));
    const totalResults: HTMLButtonElement = (<HTMLButtonElement>document.querySelector(".totalResults"));


    const pageNumber: number = url.getFromQueryString("page") ?? 1;
    const getPageItems: number = url.getFromQueryString("itemsPerPage") ?? 1;

    const maxQuestions: any = await api.queryDatabase(QUESTION_QUERY.COUNT_QUESTIONS);
    const totalQuestions: number = maxQuestions[0]["rowCount"];

    const itemsPerPage: number | string = mapNumberToPaginationValue(parseInt(String(getPageItems)));

    if (itemsPerPage !== "ALL" && typeof itemsPerPage === "number") {
        currentPageRange.innerHTML = calculateCurrentPageRange(pageNumber, itemsPerPage, totalQuestions);
        totalResults.innerHTML = totalQuestions.toString();
    } else {
        currentPageRange.innerHTML = `1 - ${totalQuestions}`;
        totalResults.innerHTML = totalQuestions.toString();
    }
}


function calculateCurrentPageRange(currentPage: number, itemsPerPage: number, totalResults: number): string {
    // Calculate the start and end indices for the current page
    const startIndex: number = (currentPage - 1) * itemsPerPage + 1;
    const endIndex: number = Math.min(currentPage * itemsPerPage, totalResults);

    // Check if the calculated start index exceeds totalResults
    if (startIndex > totalResults) {
        // Adjust the start index and end index to fit within totalResults
        const newStartIndex: number = Math.max(1, totalResults - itemsPerPage + 1);
        return `${newStartIndex} - ${totalResults}`;
    }

    // Format the range string
    return `${startIndex} - ${endIndex}`;
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
        const getPageItems: number = url.getFromQueryString("itemsPerPage") ?? 1;

        let questions: [Question];

        const itemsPerPage: number | string = mapNumberToPaginationValue(parseInt(String(getPageItems)));
        if (itemsPerPage !== "ALL") {
            // Calculate the offset for database query based on the page number
            const queryOffset: number = (pageNumber - 1) * 10;

            // Querying the database to get questions within the specified offset
            const queryParam: (string | number)[] = [itemsPerPage, queryOffset];
            questions = await api.queryDatabase(QUESTION_QUERY.GET_QUESTION_BY_PAGE_NUMBER, ...queryParam) as [Question];

        } else {
            questions = await Question.getQuestions() as [Question];
        }

        // Get the container element for rendering questions
        const questionsBody: HTMLDivElement = document.querySelector(".questions-table") as HTMLDivElement;

        // If there are no questions, return early
        if (!questions) return;

        // Iterating over each question and rendering it in the UI
        for (const question of questions) {
            // Create a Question instance for easier access to properties
            const singleQuestion: Question = createNewQuestionInstance(question);

            const userId: number = singleQuestion.userId as number;
            const questionId: number = singleQuestion.questionId as number;
            let questionUsername: string = "Unknown user";
            let questionTagString: string = "Unknown";

            const user: User = await User.retrieveUser(userId) as User;

            if (user) {
                questionUsername = user.username;
            }

            const questionTags: [CodingTag] = await CodingTag.getAllCodingTagsForQuestion(questionId) as [CodingTag];

            if (questionTags.length > 0) {
                const uniqueTagIds: any = [...new Set(questionTags.map((item: {
                    tagName: any;
                }) => item.tagName))];
                questionTagString = uniqueTagIds.join(", ");
            }

            const filteredQuestion: string = removeHTMLTagsAndExtraWhitespace(singleQuestion.questionBody);

            const questionText: string = filteredQuestion.substring(0, 80);

            const questionElement: string = createQuestionElement(
                questionUsername,
                questionTagString,
                singleQuestion.questionTitle,
                questionText + "...",
                questionId.toString()
            );

            const sanitized: string = DOMPurify.sanitize(questionElement);

            questionsBody.innerHTML += sanitized;

            const questionBodyElem: NodeListOf<HTMLDivElement> = (<NodeListOf<HTMLDivElement>>document.querySelectorAll(".question-body"));

            questionBodyElem.forEach(item => {
                item.addEventListener("click", async (): Promise<void> => {
                    const questionId: number = parseInt(item.id);
                    await handleRedirectToQuestionDetail(questionId);
                });
            });

        }
    } catch (e) {
        // Handle any errors that occur during the process
        console.error("Error in populateQuestionTable:", e);
    }
}