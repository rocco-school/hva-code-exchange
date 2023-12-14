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
    const boldButton: HTMLElement | null = document.querySelector(".bold");
    const italicButton: HTMLElement | null = document.querySelector(".italic");
    const underlineButton: HTMLElement | null = document.querySelector(".underline");
    const inlineCodeButton: HTMLElement | null = document.querySelector(".inline-code");
    const codeBlockButton: HTMLElement | null = document.querySelector(".code-block");
    const listButton: HTMLElement | null = document.querySelector(".list");
    const colorPickerButton: HTMLElement | null = document.querySelector(".color-picker");
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
            checkTextStyle(boldButton as HTMLElement, textarea);
        });

        italicButton!.addEventListener("click", (): void => {
            checkTextStyle(italicButton as HTMLElement, textarea);
        });


        underlineButton!.addEventListener("click", (): void => {
            checkTextStyle(underlineButton as HTMLElement, textarea);
        });

        inlineCodeButton!.addEventListener("click", (): void => {
            checkTextStyle(inlineCodeButton as HTMLElement, textarea);
        });

        codeBlockButton!.addEventListener("click", (): void => {
            checkTextStyle(codeBlockButton as HTMLElement, textarea);
        });

        if (listButton) {
            listButton!.addEventListener("click", (): void => {
                checkTextStyle(listButton, textarea);
            });
        }

        colorPickerButton!.addEventListener("click", (): void => {
            checkTextStyle(colorPickerButton as HTMLElement, textarea);
        });
    }

}

// Invoke the question detail page application entry point.
await setup();


/**
 * Checks the surrounding tags of the selected text in a textarea and modifies the content accordingly.
 *
 * @param {HTMLElement} element - The element triggering the text style change.
 * @param {HTMLDivElement} textarea - The textarea element.
 * @returns {Promise<void>} A Promise resolving after the content modification is complete.
 */
async function checkTextStyle(element: HTMLElement, textarea: HTMLDivElement): Promise<void> {
    const selection: Selection | null = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
        return;
    }

    const surroundedTag: string | null = getSurroundedTag(selection);

    const {beforeContent, afterContent} = extractBeforeAfterContent(selection, textarea);

    const {prefix, suffix} = getPrefixSuffix(beforeContent, afterContent, surroundedTag);

    switch (true) {
        case element.classList.contains("bold"):
            applyTextStyle(textarea, prefix, suffix, "b", selection);
            break;

        case element.classList.contains("italic"):
            applyTextStyle(textarea, prefix, suffix, "i", selection);
            break;

        case element.classList.contains("underline"):
            applyTextStyle(textarea, prefix, suffix, "span style='text-decoration: underline'", selection);
            break;

        case element.classList.contains("inline-code"):
            applyTextStyle(textarea, prefix, suffix, "code", selection);
            break;

        case element.classList.contains("code-block"):
            applyTextStyle(textarea, prefix, suffix, "code", selection);
            break;

        case element.classList.contains("list"):
            applyListStyle(textarea, prefix, suffix, selection);
            break;

        case element.classList.contains("color-picker"):
            applyColorPicker(textarea, prefix, suffix, element);
            break;
    }
}


/**
 * Gets the tag(s) that surround the selected text.
 *
 * @param {Selection} selection - The current text selection.
 * @returns {string | null} The surrounded tag(s) or null if none.
 */
function getSurroundedTag(selection: Selection): string | null {
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

        return surroundingTags.length > 0 ? surroundingTags.join(", ") : null;
    }

    return null;
}

/**
 * Extracts the content before and after the selected text.
 *
 * @param {Selection} selection - The current text selection.
 * @param {HTMLDivElement} textarea - The textarea element.
 * @returns {Object} An object containing `beforeContent` and `afterContent`.
 */
function extractBeforeAfterContent(selection: Selection, textarea: HTMLDivElement): {
    beforeContent: string,
    afterContent: string
} {
    const range: Range = selection.getRangeAt(0);
    const allContent: string = textarea.innerHTML;

    const allContentRange: Range = document.createRange();
    allContentRange.selectNodeContents(textarea);

    const beforeSelectedRange: Range = document.createRange();
    beforeSelectedRange.setStart(allContentRange.startContainer, allContentRange.startOffset);
    beforeSelectedRange.setEnd(range.startContainer, range.startOffset);

    const afterSelectedRange: Range = document.createRange();
    afterSelectedRange.setStart(range.endContainer, range.endOffset);
    afterSelectedRange.setEnd(allContentRange.endContainer, allContentRange.endOffset);

    const beforeContent: string = getFullHtmlBeforeSelection(beforeSelectedRange).replace(/<[^\/>][^>]*>\s*<\/[^>]+>/g, "");
    const afterContent: string = getFullHtmlAfterSelection(afterSelectedRange).replace(/<[^\/>][^>]*>\s*<\/[^>]+>/g, "");

    return {beforeContent, afterContent};
}

/**
 * Gets the prefix and suffix for modifying content based on surrounded tags.
 *
 * @param {string} beforeContent - The content before the selected text.
 * @param {string} afterContent - The content after the selected text.
 * @param {string | null} surroundedTag - The surrounded tag(s).
 * @returns {Object} An object containing `prefix` and `suffix`.
 */
function getPrefixSuffix(beforeContent: string, afterContent: string, surroundedTag: string | null): {
    prefix: string,
    suffix: string
} {
    let prefix: string = beforeContent;
    let suffix: string = afterContent;

    if (surroundedTag) {
        const startTag: string = `<${surroundedTag}>`;
        const endTag: string = `</${surroundedTag}>`;

        prefix = beforeContent + startTag;
        suffix = endTag + afterContent;
    }

    return {prefix, suffix};
}

/**
 * Gets the full HTML content before the selection.
 *
 * @param {Range} beforeRange - The range representing the content before the selection.
 * @returns {string} The HTML content before the selection.
 */
function getFullHtmlBeforeSelection(beforeRange: Range): string {
    const beforeContainer: HTMLDivElement = document.createElement("div");
    beforeContainer.appendChild(beforeRange.cloneContents());

    return beforeContainer.innerHTML;
}

/**
 * Gets the full HTML content after the selection.
 *
 * @param {Range} afterRange - The range representing the content after the selection.
 * @returns {string} The HTML content after the selection.
 */
function getFullHtmlAfterSelection(afterRange: Range): string {
    const afterContainer: HTMLDivElement = document.createElement("div");
    afterContainer.appendChild(afterRange.cloneContents());

    return afterContainer.innerHTML;
}

/**
 * Applies text style to the textarea content.
 *
 * @param {HTMLDivElement} textarea - The textarea element.
 * @param {string} prefix - The content before the selected text.
 * @param {string} suffix - The content after the selected text.
 * @param {string} tag - The HTML tag for text styling.
 * @param {Selection} selection - The current text selection.
 */
function applyTextStyle(textarea: HTMLDivElement, prefix: string, suffix: string, tag: string, selection: Selection): void {
    const range: Range = selection.getRangeAt(0);
    const selected: string = range.cloneContents().textContent.trim();

    const styledText: string = `<${tag}>${selected}</${tag}>`;

    textarea.innerHTML = prefix + styledText + suffix;
}

/**
 * Applies color styling to the textarea content.
 *
 * @param {HTMLDivElement} textarea - The textarea element.
 * @param {string} prefix - The content before the selected text.
 * @param {string} suffix - The content after the selected text.
 * @param {HTMLElement} element - The color picker element.
 */
function applyColorPicker(textarea: HTMLDivElement, prefix: string, suffix: string, element: HTMLElement): void {
    const colorPicker: HTMLInputElement = element as HTMLInputElement;
    const selection: Selection | null = window.getSelection();

    if (selection && selection.rangeCount > 0) {
        const range: Range = selection.getRangeAt(0);
        const selected: string = range.cloneContents().textContent.trim();
        const selectedColor: string = colorPicker.value;

        const colorPickerText: string = ` <span style="color: ${selectedColor}">${selected}</span> `;

        textarea.innerHTML = prefix + colorPickerText + suffix;
    }

    // Handle the case where no selection is present if needed
}

/**
 * Applies list style to the textarea content.
 *
 * @param {HTMLDivElement} textarea - The textarea element.
 * @param {string} prefix - The content before the selected text.
 * @param {string} suffix - The content after the selected text.
 * @param {Selection} selection - The current text selection.
 */
function applyListStyle(textarea: HTMLDivElement, prefix: string, suffix: string, selection: Selection): void {
    const range: Range = selection.getRangeAt(0);
    const selected: string = range.cloneContents().textContent.trim();

    const list: string = `<ul><li>${selected}</li></ul>`;

    textarea.innerHTML = prefix + list + suffix;
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




