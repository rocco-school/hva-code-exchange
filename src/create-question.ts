import "./config";
import {
    addClickListenersToOptions,
    handleButtonClick,
    handleDocumentClick,
    setupCustomSelect,
    setupSelectBoxClickHandling,
    updateSelectedOptions
} from "./components/customSelect";
import {CodingTag} from "./models/codingTag";
import {JWTPayload} from "jose";
import {security} from "./components/security";
import {url} from "@hboictcloud/api";
import {Question} from "./models/question";

/**
 * The main application entry point for the create-question page.
 *
 * This function initializes the create-question page, including event handling,
 * user verification, and other related functionality.
 *
 * @returns {Promise<void>} A Promise that resolves when the application setup is complete.
 */
async function setup(): Promise<void> {
    // Check the security status by calling the 'security' function.
    const loginStatus: JWTPayload | boolean = await security();

    // If the user is authenticated (loginStatus is true), redirect them to the index.html page.
    if (!loginStatus) {
        url.redirect("/question-list.html");
    }

    const selectOptions: Element | null = document.querySelector(".options");
    if (selectOptions) await populateTagSelect(selectOptions);

    // Select all elements with the class "custom-select"
    const customSelects: NodeListOf<Element> = document.querySelectorAll(".custom-select");
    const postButton: HTMLButtonElement | null = document.querySelector(".btn_submit");
    const textarea: HTMLDivElement | null = document.querySelector(".question-body-textarea");
    const questionTitleInput: HTMLInputElement | null = document.querySelector(".question-title-input");
    const boldButton: HTMLButtonElement | null = document.querySelector(".bold");
    const italicButton: HTMLButtonElement | null = document.querySelector(".italic");
    const underlineButton: HTMLButtonElement | null = document.querySelector(".underline");
    const inlineCodeButton: HTMLButtonElement | null = document.querySelector(".inline-code");
    const codeBlockButton: HTMLButtonElement | null = document.querySelector(".code-block");
    const listButton: HTMLButtonElement | null = document.querySelector(".list");
    const colorPickerButton: HTMLButtonElement | null = document.querySelector(".color-picker");
    const selectBoxes: NodeListOf<Element> = document.querySelectorAll(".select-box");


    // Update selected options for each custom select
    customSelects.forEach(item => {
        updateSelectedOptions(item);
    });

    // Apply setup to all custom select elements
    customSelects.forEach(setupCustomSelect);

    // Add click event listeners to options within each custom select
    customSelects.forEach(addClickListenersToOptions);

    // Add a click event listener to the document for handling custom select elements and removing tags
    document.addEventListener("click", handleDocumentClick);

    // Set up click event handling for select boxes
    setupSelectBoxClickHandling(selectBoxes);

    // Update selected options for the first custom select (assuming there's at least one)
    updateSelectedOptions(customSelects[0]);

    // Add a click event listener to the submit button to handle the click
    postButton!.addEventListener("click", async function (): Promise<void> {
        let questionTags: any[] = [];
        let questionTitle: string = "";
        let questionBody: string = "";
        // Use the async function handleButtonClick when the submit button is clicked
        await handleButtonClick().then((result: string | null): void => {
            if (result !== null) {
                // Handle the valid result
                const tags: string[] = result.split(", ");

                for (const tagsKey in tags) {
                    questionTags.push(tags[tagsKey]);
                }

            } else {
                // Handle the case where the input is not valid
                console.log("Input is not valid.");
            }
        });

        if (questionTitleInput) {
            questionTitle = questionTitleInput.value;
        }

        if (textarea) {
            questionBody = textarea.innerHTML;
        }

        if (questionTitle && questionBody && questionTags.length !== 0) {
            const userId: number = loginStatus["userId"];

            const questionObject: Question = new Question(
                null,
                userId,
                questionTitle,
                questionBody,
                false,
                null,
                null,
            );

            const question: Question[] | string = await questionObject.saveQuestion();

            const questionId: number = question["insertId"];
            if (questionId) {
                const createQuestionTags: number | string = await Question.insertQuestionTag(questionId, questionTags);

                console.log(createQuestionTags);
            }
        }
    });

    if (textarea) {

        boldButton!.addEventListener("click", (): void => {
            checkTextStyle(boldButton, textarea);
        });

        italicButton!.addEventListener("click", (): void => {
            checkTextStyle(italicButton, textarea);
        });


        underlineButton!.addEventListener("click", (): void => {
            checkTextStyle(underlineButton, textarea);
        });

        inlineCodeButton!.addEventListener("click", (): void => {
            checkTextStyle(inlineCodeButton, textarea);
        });

        codeBlockButton!.addEventListener("click", (): void => {
            checkTextStyle(codeBlockButton, textarea);
        });

        if (listButton) {
            listButton!.addEventListener("click", (): void => {
                checkTextStyle(listButton, textarea);
            });
        }

        colorPickerButton!.addEventListener("click", (): void => {
            checkTextStyle(colorPickerButton, textarea);
        });
    }

}

// Invoke the question detail page application entry point.
await setup();


async function checkTextStyle(element: any, textarea: HTMLDivElement): Promise<void> {
    // const selected: string = textarea.value.substr(textarea.selectionStart, textarea.selectionEnd - textarea.selectionStart).trim();

    const selection: Selection | null = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
        return;
    }

    let surroundedTag: string | null = null;

    if (selection && selection.rangeCount > 0) {
        const range: Range = selection.getRangeAt(0);
        const startContainer: Node = range.startContainer;
        const endContainer: Node = range.endContainer;

        let currentNode: Node | null = startContainer.parentNode;
        const surroundingTags: string[] = [];

        while (currentNode && currentNode !== endContainer.parentNode) {
            if (currentNode instanceof Element) {
                surroundingTags.push(currentNode.tagName.toLowerCase());
            }
            currentNode = currentNode.parentNode;
        }

        if (surroundingTags.length > 0) {
            surroundedTag = surroundingTags.join(", ");
            console.log(`The selected text is surrounded by the following tags: ${surroundingTags.join(", ")}`);
        } else {
            console.log("The selected text is not surrounded by any tags.");
        }
    }
    const range: Range = selection.getRangeAt(0);
    const allContent: string = textarea.innerHTML;

    // Create a range to encompass the entire content
    const allContentRange: Range = document.createRange();
    allContentRange.selectNodeContents(textarea);

    // Create a range to encompass the selected content
    const selectedContentRange: Range = range.cloneRange();
    selectedContentRange.selectNodeContents(range.commonAncestorContainer);

    // Create a range to encompass the content before the selection
    const beforeSelectedRange: Range = document.createRange();
    beforeSelectedRange.setStart(allContentRange.startContainer, allContentRange.startOffset);
    beforeSelectedRange.setEnd(range.startContainer, range.startOffset);

    // Create a range to encompass the content after the selection
    const afterSelectedRange: Range = document.createRange();
    afterSelectedRange.setStart(range.endContainer, range.endOffset);
    afterSelectedRange.setEnd(allContentRange.endContainer, allContentRange.endOffset);

    // Extract the HTML content from the ranges
    const selected: string = range.cloneContents().textContent.trim();

    const beforeContent: string = getFullHtmlBeforeSelection(beforeSelectedRange);
    const afterContent: string = getFullHtmlAfterSelection(afterSelectedRange);

    function getFullHtmlBeforeSelection(beforeRange: Range): string {
        const beforeContainer: HTMLDivElement = document.createElement("div");
        beforeContainer.appendChild(beforeRange.cloneContents());

        return beforeContainer.innerHTML;
    }

    function getFullHtmlAfterSelection(afterRange: Range): string {
        const afterContainer: HTMLDivElement = document.createElement("div");
        afterContainer.appendChild(afterRange.cloneContents());

        return afterContainer.innerHTML;
    }

    const before: string = beforeContent.replace(/<[^\/>][^>]*>\s*<\/[^>]+>/g, "");
    const after: string = afterContent.replace(/<[^\/>][^>]*>\s*<\/[^>]+>/g, "");

    let prefix: string = before;
    let suffix: string = after;

    if (surroundedTag) {
        const startTag: string = "<" + surroundedTag + ">";
        const endTag: string = "</" + surroundedTag + ">";

        prefix = before + startTag;
        suffix = endTag + after;
    }

    switch (true) {
        case element.classList.contains("bold"):
            const bold: string = "<b>" + selected + "</b> ";

            textarea.innerHTML = prefix + bold + suffix;
            break;

        case element.classList.contains("italic"):
            const italic: string = "<i>" + selected + "</i> ";

            textarea.innerHTML = prefix + italic + suffix;
            break;

        case element.classList.contains("underline"):
            const underline: string = "<span style='text-decoration: underline'>" + selected + "</span> ";

            textarea.innerHTML = prefix + underline + suffix;
            break;

        case element.classList.contains("inline-code"):
            const inlineCode: string = "<code>" + selected + "</code> ";

            textarea.innerHTML = prefix + inlineCode + suffix;
            break;

        case element.classList.contains("code-block"):
            const codeBlock: string = "<code>" + selected + "</code> ";

            textarea.innerHTML = prefix + codeBlock + suffix;
            break;


        case element.classList.contains("list"):
            const list: string = "<ul><li>" + selected + "</li></ul> ";

            textarea.innerHTML = prefix + list + suffix;
            break;


        case element.classList.contains("color-picker"):
            const colorPicker: HTMLInputElement = element as HTMLInputElement;

            colorPicker.addEventListener("change", function (event: Event): void {
                const selectedColor: string = (event.target as HTMLInputElement).value;

                const colorPicker: string = ` <span style="color: ${selectedColor}">` + selected + "</span> ";

                textarea.innerHTML = prefix + colorPicker + suffix;
                return; // Use return to exit the event listener early

            });
            break;
    }
}


async function populateTagSelect(optionsBody: Element): Promise<void> {
    const codingTags: CodingTag[] | string = await CodingTag.getCodingTags();

    if (codingTags.length === 0) return;

    for (const codingTag of codingTags) {
        const tag: CodingTag = codingTag as CodingTag;

        const newOption: string = "<div class=\"option\" tabindex=\"0\" data-value=\"" + tag.tagId + "\">" + tag.tagName + "</div>";
        optionsBody.innerHTML += newOption;
    }
}




