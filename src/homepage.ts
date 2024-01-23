import "./config";
import {api} from "@hboictcloud/api";
import {QUESTION_QUERY} from "./query/question.query";
import {Question} from "./models/question";
import {User} from "./models/user";
import {handleRedirectToQuestionDetail} from "./components/handleRedirects";
import {createNewQuestionInstance} from "./components/handleModelInstances";
import {CodingTag} from "./models/codingTag";
import {createQuestionElement} from "./components/htmlTemplate";
import DOMPurify from "dompurify";

// Define an asynchronous function to fetch and display the most recent questions
async function getMostRecentQuestions(): Promise<void> {

    try {
        // Fetch recent questions from the database using an API call
        const recentQuestions: [Question] = await api.queryDatabase(QUESTION_QUERY.SELECT_RECENT_FIVE_QUESTIONS) as [Question];

        // Select the HTML element where recent questions will be displayed
        const recentQuestionsBody: HTMLElement = (<HTMLElement>document.querySelector(".questions-table"));

        // Iterate over each recent question
        for (const question of recentQuestions) {

            const singleQuestion: Question = createNewQuestionInstance(question);

            const userId: number = singleQuestion.userId as number;
            const questionId: number = singleQuestion.questionId as number;
            const questionBody: string = singleQuestion.questionBody as string;
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

            const questionElement: string = createQuestionElement(
                singleQuestion.questionTitle.slice(0, 30),
                questionUsername,
                questionTagString,
                singleQuestion.questionTitle,
                questionBody.slice(0, 170) + "...",
                questionId.toString()
            );

            const sanitized: string = DOMPurify.sanitize(questionElement);

            recentQuestionsBody.innerHTML += sanitized;

            const questionBodyElem: NodeListOf<HTMLDivElement> = (<NodeListOf<HTMLDivElement>>document.querySelectorAll(".question-body"));

            questionBodyElem.forEach(item => {
                item.addEventListener("click", async (): Promise<void> => {
                    const questionId: number = parseInt(item.id);
                    await handleRedirectToQuestionDetail(questionId);
                });
            });
        }

    } catch (e) {
        // Handle any errors that occur during the execution of the function
        console.error(e);
    }
}

// Invoke the function to fetch and display the most recent questions
await getMostRecentQuestions();




