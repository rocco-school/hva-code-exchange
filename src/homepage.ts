// Import necessary modules and configurations
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
        recentQuestions.forEach(async (question): Promise<void> => {
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
                const questionStatsContainer: HTMLDivElement = ul.appendChild(document.createElement("div"));
                questionStatsContainer.classList.add("questionStats");

                // Create UI elements for question stats (upvote, downvote, votes count, answers count, posted at, updated at)

                // Upvote Button
                const liQuestionUpvote: HTMLLIElement = questionStatsContainer.appendChild(document.createElement("li"));
                const questionUpvote: HTMLButtonElement = liQuestionUpvote.appendChild(document.createElement("button"));
                questionUpvote.id = "questionUpvote";
                questionUpvote.innerHTML = "upvote"; // TODO add a row in the database for upvotes

                // Votes Count
                const liquestionVotes: HTMLLIElement = questionStatsContainer.appendChild(document.createElement("li"));
                const questionVotes: HTMLDivElement = liquestionVotes.appendChild(document.createElement("div"));
                questionVotes.id = "questionVotes";
                questionVotes.innerHTML = "0"; // TODO a function to calculate the amount of votes 

                // Downvote Button
                const liQuestionDownvote: HTMLLIElement = questionStatsContainer.appendChild(document.createElement("li"));
                const questionDownvote: HTMLButtonElement = liQuestionDownvote.appendChild(document.createElement("button"));
                questionDownvote.id = "questionDownvote";
                questionDownvote.innerHTML = "Downvote"; // TODO add a row in the database for downvotes

                // Answers Count
                const liquestionAnswers: HTMLLIElement = questionStatsContainer.appendChild(document.createElement("li"));
                const questionAnswers: HTMLDivElement = liquestionAnswers.appendChild(document.createElement("div"));
                questionAnswers.id = "questionAnswers";
                questionAnswers.innerHTML = "answers:" + 0; 

                // Posted At
                const liquestionPostedAt: HTMLLIElement = questionStatsContainer.appendChild(document.createElement("li"));
                const questionPostedAt: HTMLDivElement = liquestionPostedAt.appendChild(document.createElement("div"));
                questionPostedAt.id = "questionPostedAt";

                // Display the posted timestamp for the question
                if (questionPostedAt) {
                    questionPostedAt.innerHTML = "posted at: " + singleQuestion.createdAt;
                }

                // Updated At
                const liquestionUpdatedAt: HTMLLIElement = questionStatsContainer.appendChild(document.createElement("li"));
                const questionUpdatedAt: HTMLDivElement = liquestionUpdatedAt.appendChild(document.createElement("div"));
                questionUpdatedAt.id = "questionUpdatedAt";
                questionUpdatedAt.innerHTML = "updated at: " + singleQuestion.createdAt;

                // Question Content
                const questionContentContainer: HTMLDivElement = ul.appendChild(document.createElement("div"));
                questionContentContainer.classList.add("questionContent");

                // Display the question title
                const liQuestionTitle: HTMLLIElement = questionContentContainer.appendChild(document.createElement("li"));
                const questionTitle: HTMLHeadElement = liQuestionTitle.appendChild(document.createElement("h3"));
                questionTitle.id = "questionTitle";

                if (questionTitle) {
                    questionTitle.innerHTML = singleQuestion.questionTitle;
                }

                // Display an example of the question body
                const liQuestionBodyExample: HTMLLIElement = questionContentContainer.appendChild(document.createElement("li"));
                const questionBodyExample: HTMLParagraphElement = liQuestionBodyExample.appendChild(document.createElement("p"));
                questionBodyExample.id = "questionBodyExample";

                if (questionBodyExample) {
                    questionBodyExample.innerHTML = singleQuestion.questionBody;
                }

                // Question User
                const questionUserContainer: HTMLDivElement = ul.appendChild(document.createElement("div"));
                questionUserContainer.classList.add("questionUser"); 

                // Question Creator Picture
                const liQuestionCreatorPicture: HTMLLIElement = questionUserContainer.appendChild(document.createElement("li"));
                const questionCreatorPicture: HTMLImageElement = liQuestionCreatorPicture.appendChild(document.createElement("img"));
                questionCreatorPicture.id = "creatorPicture";

                // Question Creator
                const liQuestionCreator: HTMLLIElement = questionUserContainer.appendChild(document.createElement("li"));
                const questionCreator: HTMLDivElement = liQuestionCreator.appendChild(document.createElement("div"));
                questionCreator.id = "questionCreator";

                if (questionCreator) {
                }

                // TODO integrate tags into the questions
            }
        });

    } catch (e) {
        // Handle any errors that occur during the execution of the function
        console.error(e);
    }
}

// Invoke the function to fetch and display the most recent questions
getMostRecentQuestions();


