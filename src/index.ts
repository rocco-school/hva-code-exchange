import "./config";
import {api} from "@hboictcloud/api";
import {QUESTION_QUERY} from "./query/question.query";
import {handleRedirectToQuestionDetail} from "./components/handleRedirects";

/**
 * Deze methode wordt aangeroepen als de pagina is geladen, dat gebeurd helemaal onderin!
 */
async function setup(): Promise<void> {

    await getAllQuestions();

    const createQuestion: HTMLButtonElement = (<HTMLButtonElement>document.querySelector(".create-question-button"));
    const createQuestionForm: HTMLButtonElement = (<HTMLButtonElement>document.querySelector(".create-question"));
    const questionForm: HTMLButtonElement = (<HTMLButtonElement>document.querySelector(".question-form"));
    const cancelForm: HTMLButtonElement = (<HTMLButtonElement>document.querySelector(".cancel-create-question"));

    createQuestion.addEventListener("click", (): void => {
        console.log("clicked!");
        createQuestionForm.classList.remove("hidden");
    });

    cancelForm.addEventListener("click", (): void => {
        if (createQuestionForm) {
            createQuestionForm.classList.add("hidden");
        }

    });

    questionForm.addEventListener("submit", async function (e): Promise<void> {
        e.preventDefault();

        const questionTitle: HTMLButtonElement = (<HTMLButtonElement>document.getElementById("questionTitle"));
        const questionSelect: HTMLButtonElement = (<HTMLButtonElement>document.querySelector(".question-select"));
        const question: HTMLButtonElement = (<HTMLButtonElement>document.getElementById("question"));

        console.log(questionTitle.value, "title");
        console.log(questionSelect.value, "select");
        console.log(question.value, "question");


        try {
            const data: any[] = [94, questionTitle.value, question.value, 0];
            const questionQuery: any = await api.queryDatabase(QUESTION_QUERY.CREATE_QUESTION, ...data);

            if (questionQuery) {
                console.log("Successfully created question!");
                createQuestionForm.classList.add("hidden");
                location.reload();
            }
        } catch (e) {
            console.error(e);
        }
    });
}

// Run bij het opstarten de setup functie
await setup();


async function getAllQuestions(): Promise<void> {
    try {
        const questions: any = await api.queryDatabase(QUESTION_QUERY.SELECT_QUESTIONS);
        const questionsBody: HTMLButtonElement = (<HTMLButtonElement>document.querySelector(".questions-body"));
        if (!questions) return;

        questions.forEach((question): void => {
            const tr: HTMLTableRowElement | undefined = questionsBody?.appendChild(document.createElement("tr"));
            if (tr) {
                tr.setAttribute("id", question["question_id"]);
                tr.setAttribute("class", "question");
                tr.setAttribute("class", "pointer");
                const td: HTMLTableCellElement = tr.appendChild(document.createElement("td"));
                const container: HTMLDivElement = td.appendChild(document.createElement("div"));
                container.setAttribute("class", "d-flex");
                const count: HTMLDivElement = container.appendChild(document.createElement("div"));
                count.setAttribute("class", "answer-count");
                const countSpan: HTMLSpanElement = count.appendChild(document.createElement("span"));
                if (countSpan) {
                    countSpan.innerHTML = "Answers: 10"; // TODO change this into actual answer count.
                }

                const questionBody: HTMLDivElement = container.appendChild(document.createElement("div"));

                const questionTitle: HTMLDivElement = questionBody.appendChild(document.createElement("div"));
                questionTitle.setAttribute("class", "mb-2 text-primary");
                if (questionTitle) {
                    questionTitle.innerHTML = question["title"];
                }
                const questionText: HTMLDivElement = questionBody.appendChild(document.createElement("div"));
                if (questionText) {
                    questionText.innerHTML = question["body"];
                }

                tr.addEventListener("click", (): void => {
                    handleRedirectToQuestionDetail(tr);
                });
            }
        });

        console.log(questions);
        console.log(questionsBody);

    } catch (e) {
        console.error(e);
    }
}