import "./config";
import { api } from "@hboictcloud/api";
import { QUESTION_QUERY } from "./query/question.query";
import { Question } from "./models/question";

async function setup(): Promise<void> {
    try {
        const recentQuestions: [Question] = await api.queryDatabase(QUESTION_QUERY.SELECT_RECENT_FIVE_QUESTIONS) as [Question];
        const recentQuestionsBody: HTMLElement | null = document.querySelector(".recentQuestions");
        
        console.log(recentQuestions);
        
        recentQuestions.forEach((question): void => {
            const singleQuestion: Question = new Question(
                question.questionId,
                question.userId,
                question.questionTitle,
                question.questionBody,
                question.isClosed,
                question.createdAt,
                question.updatedAt
            );

            const questionBox: HTMLDivElement = recentQuestionsBody?.appendChild(document.createElement("ul"));

            if (questionBox) {
                questionBox.setAttribute
            }
        });

    } catch (e) {
        console.error(e);
    }



}

setup();