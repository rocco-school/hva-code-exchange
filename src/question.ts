import "./config";
import {Question} from "./models/question";
import {QuestionService} from "./services/questionService";
import {AnswerWithUser} from "./models/interface/answerWithUser";
import {User} from "./models/user";
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

    // Retrieves a question from the database based on the URL parameter question ID.
    const question: Question = await QuestionService.retrieveQuestion(questionId);

    if (!question) location.replace("index.html");

    (<HTMLInputElement>document.querySelector(".question-title")).innerHTML = <string>question?.questionTitle;
    (<HTMLInputElement>document.querySelector(".question-body")).innerHTML = <string>question?.questionBody;
    const answersBody: HTMLDivElement = (<HTMLDivElement>document.querySelector(".answers"));

    const answers: AnswerWithUser[] | string = await Question.getAnswersForQuestion(questionId);

    console.log(answers);

    if (answers.length !== 0) {

        for (const singleAnswer of answers) {

            const answer: AnswerWithUser = singleAnswer as AnswerWithUser;


            let totalAnswers: number | string = await User.getTotalAnswers(answer.userId);
            let totalQuestions: number | string = await User.getTotalQuestions(answer.userId);


            if (typeof totalAnswers !== "number") {
                totalAnswers = 0;
            }

            if (typeof totalQuestions !== "number") {
                totalQuestions = 0;
            }


            const createdAt: Date | null = answer.createdAt;
            let date: string = Date.now().toString();
            if (createdAt !== null) {
                const theDate: Date = new Date(createdAt);
                date = theDate.toISOString().slice(0, 10);
            }

            const username: string = answer.firstname + " " + answer.lastname as string;

            const answerElement: string = createAnswerElement(
                answer.answerBody,
                date,
                "https://ui-avatars.com/api/?name=" + username,
                username,
                totalAnswers,
                totalQuestions
            );

            answersBody.innerHTML += answerElement;
        }
    }
}

// Invoke the question detail page application entry point.
await setup();


function createAnswerElement(answerText: string, createdAt: string, profilePictureSrc: string, username: string, answersCount: number, questionsCount: number): string {
    return `
        <div class="answer">
            <div class="answer-container">
                <div class="vote">
                    <img class="arrow" alt="upvote answer" src="assets/img/icons/arrow-up.svg">
                    <span class="upvote-count">0</span>
                    <img class="arrow arrow-down" alt="upvote answer" src="assets/img/icons/arrow-up.svg">
                </div>
                <div class="answer-body">
                    <span>${answerText}</span>
                    <div class="created-info">
                        <div class="inner-info">
                            <span>Created at: ${createdAt}</span>
                            <div class="person">
                                <img class="profile-picture" alt="profile picture" src="${profilePictureSrc}">
                                <div class="personal-information">
                                    <span>${username}</span>
                                    <span>Answers: ${answersCount}</span>
                                    <span>Questions: ${questionsCount}</span>
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
        const checkedParam: string | null = params.get("id");

        if (checkedParam) {
            // Set the global "questionId" variable to the retrieved value.
            questionId = checkedParam;
        }
    } catch (e) {
        console.log(e);
    }
}