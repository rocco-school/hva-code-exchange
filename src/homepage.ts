import "./config";
import { api } from "@hboictcloud/api";
import { QUESTION_QUERY } from "./query/question.query";
import { Question } from "./models/question";

// Define an asynchronous function to fetch and display the most recent questions
async function getMostRecentQuestions(): Promise<void> {
    try {
        // Fetch recent questions from the database using an API call
        const recentQuestions: [Question] = await api.queryDatabase(QUESTION_QUERY.SELECT_RECENT_FIVE_QUESTIONS) as [Question];
        
        // Select the HTML element where recent questions will be displayed
        const recentQuestionsBody: HTMLElement | null = document.querySelector(".recentQuestions");
        
        // Log the fetched recent questions to the console for debugging
        console.log(recentQuestions);
        
        // Iterate through each recent question and render it in the UI
        recentQuestions.forEach((question): void => {
            // Create a new Question object based on the fetched question data
            const singleQuestion: Question = new Question(
                question.questionId,
                question.userId,
                question.questionTitle,
                question.questionBody,
                question.isClosed,
                question.createdAt,
                question.updatedAt
            );

            // Create a container for each question in the UI
            const container: HTMLUListElement | undefined = recentQuestionsBody?.appendChild(document.createElement("ul"));

            // Check if the container was successfully created
            if (container) {
                // Add styling to the container
                container.classList.add("container");

                // Create a list element for the question content
                const ul: HTMLUListElement = container.appendChild(document.createElement("ul"));
                ul.classList.add("questionBox");

                // Question Stats
                const QuestionStatsContainer: HTMLDivElement = ul.appendChild(document.createElement("div"));
                QuestionStatsContainer.classList.add("questionStats");

                // Create UI elements for question stats (upvote, downvote, votes count, answers count, posted at, updated at)
                const questionUpvote: HTMLButtonElement = QuestionStatsContainer.appendChild(document.createElement("button"));
                questionUpvote.id = "questionUpvote";
                questionUpvote.innerHTML = "upvote";

                const questionVotes: HTMLDivElement = QuestionStatsContainer.appendChild(document.createElement("div"));
                questionVotes.id = "questionVotes";
                questionVotes.innerHTML = "0";

                const questionDownvote: HTMLButtonElement = QuestionStatsContainer.appendChild(document.createElement("button"));
                questionDownvote.id = "questionDownvote";
                questionDownvote.innerHTML = "Downvote";

                const questionAnswers: HTMLDivElement = QuestionStatsContainer.appendChild(document.createElement("div"));
                questionAnswers.id = "questionAnswers";
                questionAnswers.innerHTML = "answers:" + 0;

                const questionPostedAt: HTMLDivElement = QuestionStatsContainer.appendChild(document.createElement("div"));
                questionPostedAt.id = "questionPostedAt";
                
                // Display the posted timestamp for the question
                if (questionPostedAt) {
                    questionPostedAt.innerHTML = "posted at: " + singleQuestion.createdAt;
                }

                const questionUpdatedAt: HTMLDivElement = QuestionStatsContainer.appendChild(document.createElement("div"));
                questionUpdatedAt.id = "questionUpdatedAt";
                questionUpdatedAt.innerHTML = "updated at: " + singleQuestion.createdAt;

                // Question Content
                const QuestionContentContainer: HTMLDivElement = ul.appendChild(document.createElement("div"));
                QuestionContentContainer.classList.add("questionContent");

                // Display the question title
                const questionTitle: HTMLHeadElement = QuestionContentContainer.appendChild(document.createElement("h3"));
                questionTitle.id = "questionTitle";
                
                if (questionTitle) {
                    questionTitle.innerHTML = singleQuestion.questionTitle;
                }

                // Display an example of the question body
                const questionBodyExample: HTMLParagraphElement = QuestionContentContainer.appendChild(document.createElement("p"));
                questionBodyExample.id = "questionBodyExample";
                
                if (questionBodyExample) {
                    questionBodyExample.innerHTML = singleQuestion.questionBody;
                }

                // Question User
                const QuestionUserContainer: HTMLDivElement = ul.appendChild(document.createElement("div"));
                QuestionUserContainer.classList.add("questionUser");
            }
        });

    } catch (e) {
        // Handle any errors that occur during the execution of the function
        console.error(e);
    }
}

// Invoke the function to fetch and display the most recent questions
getMostRecentQuestions();
