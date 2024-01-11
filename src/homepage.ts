import {api} from "@hboictcloud/api";
import {QUESTION_QUERY} from "./query/question.query";
import {Question} from "./models/question";
import {USER_QUERY} from "./query/user.query";
import {User} from "./models/user";
import {ANSWER_QUERY} from "./query/answer.query";
import {handleRedirectToQuestionDetail} from "./components/handleRedirects";

// Define an asynchronous function to fetch and display the most recent questions
async function getMostRecentQuestions(): Promise<void> {
    try {
        // Fetch recent questions from the database using an API call
        const recentQuestions: [Question] = await api.queryDatabase(QUESTION_QUERY.SELECT_RECENT_FIVE_QUESTIONS) as [Question];

        // Select the HTML element where recent questions will be displayed
        const recentQuestionsBody: HTMLElement | null = document.querySelector(".recentQuestions");

        // Iterate over each recent question
        for (const question of recentQuestions) {
            // Create a Question instance from the retrieved data
            const singleQuestion: Question = new Question(
                question.questionId,
                question.userId,
                question.questionTitle,
                question.questionBody,
                question.isClosed,
                question.totalUpvotes,
                question.totalDownvotes,
                question.createdAt,
                question.updatedAt,
            );

            // Create a container for each question in the UI
            const container: HTMLUListElement | undefined = recentQuestionsBody?.appendChild(document.createElement("ul"));

            // Check if the container was successfully created
            if (container) {
                let votes: number = 0;

                // Add styling to the container
                container.classList.add("container");
                container.id = question.questionId?.toString();

                container.addEventListener("click", (): void => {
                    handleRedirectToQuestionDetail(question.questionId);
                });

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
                questionUpvote.classList.add("questionUpvote");
                questionUpvote.innerHTML = "upvote";

                // Votes Count
                const liquestionVotes: HTMLLIElement = questionStatsContainer.appendChild(document.createElement("li"));
                const questionVotes: HTMLDivElement | any = liquestionVotes.appendChild(document.createElement("div"));
                questionVotes.classList.add("questionVotes");
                questionVotes.innerHTML = "0";

                // Downvote Button
                const liQuestionDownvote: HTMLLIElement = questionStatsContainer.appendChild(document.createElement("li"));
                const questionDownvote: HTMLButtonElement = liQuestionDownvote.appendChild(document.createElement("button"));
                questionDownvote.classList.add("questionDownvote");
                questionDownvote.innerHTML = "Downvote";

                // Attach event listeners to upvote and downvote buttons
                questionUpvote.addEventListener("click", async () => {
                    votes++;
                    questionVotes.innerHTML = votes;
                    votesColor(votes, questionVotes);
                });

                questionDownvote.addEventListener("click", () => {
                    votes--;
                    questionVotes.innerHTML = votes;
                    votesColor(votes, questionVotes);
                });

                // Answers Count
                const liquestionAnswers: HTMLLIElement = questionStatsContainer.appendChild(document.createElement("li"));
                const questionAnswers: HTMLDivElement = liquestionAnswers.appendChild(document.createElement("div"));
                questionAnswers.classList.add("questionAnswers");

                if (questionAnswers) {
                    // Fetch the number of answers for the current question
                    const answerAmount: any = await api.queryDatabase(ANSWER_QUERY.COUNT_ANSWERS_FROM_QUESTION, question.questionId);
                    questionAnswers.innerHTML = "answers: " + answerAmount[0].answerCount;
                }

                // Posted At
                const liquestionPostedAt: HTMLLIElement = questionStatsContainer.appendChild(document.createElement("li"));
                const questionPostedAt: HTMLDivElement = liquestionPostedAt.appendChild(document.createElement("div"));
                questionPostedAt.classList.add("questionPostedAt");

                // Display the posted timestamp for the question
                if (questionPostedAt) {
                    const datePostedAt: any = singleQuestion.createdAt;
                    questionPostedAt.innerHTML = "posted at: " + datePostedAt.replace("T", "  ").slice(0, -8);
                }

                // Updated At
                const liquestionUpdatedAt: HTMLLIElement = questionStatsContainer.appendChild(document.createElement("li"));
                const questionUpdatedAt: HTMLDivElement = liquestionUpdatedAt.appendChild(document.createElement("div"));
                questionUpdatedAt.classList.add("questionUpdatedAt");

                // Display the updated timestamp for the question
                if (questionUpdatedAt) {
                    const dateUpdatedAt: any = singleQuestion.updatedAt;
                    questionUpdatedAt.innerHTML = "updated at: " + dateUpdatedAt.replace("T", "  ").slice(0, -8);
                }

                // Question Content
                const questionContentContainer: HTMLDivElement = ul.appendChild(document.createElement("div"));
                questionContentContainer.classList.add("questionContent");

                // Display the question title
                const liQuestionTitle: HTMLLIElement = questionContentContainer.appendChild(document.createElement("li"));
                const questionTitle: HTMLHeadElement = liQuestionTitle.appendChild(document.createElement("h3"));
                questionTitle.classList.add("questionTitle");

                if (questionTitle) {
                    questionTitle.innerHTML = singleQuestion.questionTitle;
                }

                // Display an excerpt of the question body
                const liQuestionBodyExample: HTMLLIElement = questionContentContainer.appendChild(document.createElement("li"));
                const questionBodyExample: HTMLParagraphElement = liQuestionBodyExample.appendChild(document.createElement("p"));
                questionBodyExample.classList.add("questionBodyExample");

                if (questionBodyExample) {
                    questionBodyExample.innerHTML = singleQuestion.questionBody.substring(0, 350);
                    // Truncate long question bodies and add ellipsis
                    if (questionBodyExample.innerHTML.length > 200) {
                        questionBodyExample.innerHTML += "...";
                    }
                }

                // Display question tags
                const divQuestionTags: HTMLDivElement = questionContentContainer.appendChild(document.createElement("div"));
                divQuestionTags.classList.add("questionTags");
                const questionTags: any = await api.queryDatabase(QUESTION_QUERY.SELECT_QUESTION_TAG, question.questionId);

                if (questionTags.length > 0) {
                    for (const getTagId of questionTags) {
                        const liQuestionTags: HTMLLIElement = divQuestionTags.appendChild(document.createElement("li"));
                        const questionTag: HTMLDivElement = liQuestionTags.appendChild(document.createElement("div"));
                        questionTag.classList.add("questionTag");
                        questionTag.innerHTML = getTagId.tagName;
                    }
                }

                // Question User
                const questionUserContainer: HTMLDivElement = ul.appendChild(document.createElement("div"));
                questionUserContainer.classList.add("questionUser");

                // Question Creator Picture
                const liQuestionCreatorPicture: HTMLLIElement = questionUserContainer.appendChild(document.createElement("li"));
                const questionCreatorPicture: HTMLImageElement = liQuestionCreatorPicture.appendChild(document.createElement("img"));
                questionCreatorPicture.classList.add("creatorPicture");

                // Question Creator
                const liQuestionCreator: HTMLLIElement = questionUserContainer.appendChild(document.createElement("li"));
                const questionCreator: HTMLDivElement = liQuestionCreator.appendChild(document.createElement("div"));
                questionCreator.classList.add("questionCreator");

                if (questionCreator) {
                    // Search for the user data based on the user ID
                    const searchForUserId: number = singleQuestion.userId;
                    const userData: [User] = await api.queryDatabase(USER_QUERY.SELECT_USER, searchForUserId) as [User];

                    // Check if user data is available
                    if (userData.length < 0) return;

                    // Display the username of the question creator
                    questionCreator.innerHTML = userData[0].username;

                    questionCreatorPicture.src = "https://ui-avatars.com/api/?name=" + userData[0].username + "&background=random";
                }

                // TODO integrate tags into the questions
            }
        }

    } catch (e) {
        // Handle any errors that occur during the execution of the function
        console.error(e);
    }
}

// Function to change the color of the vote count based on the number of votes
function votesColor(votes: number, questionVotes: HTMLElement): void {
    if (votes > 0) {
        questionVotes.style.color = "green";
    } else if (votes < 0) {
        questionVotes.style.color = "red";
    } else if (votes === 0) {
        questionVotes.style.color = "black";
    }
}

// Invoke the function to fetch and display the most recent questions
await getMostRecentQuestions();




