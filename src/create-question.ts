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

/**
 * The main application entry point for the create-question page.
 *
 * This function initializes the create-question page, including event handling,
 * user verification, and other related functionality.
 *
 * @returns {Promise<void>} A Promise that resolves when the application setup is complete.
 */
async function setup(): Promise<void> {
    const selectOptions: Element | null = document.querySelector(".options");
    if (selectOptions) await populateTagSelect(selectOptions);

    // Select all elements with the class "custom-select"
    const customSelects: NodeListOf<Element> = document.querySelectorAll(".custom-select");

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

    // Select all elements with the class "select-box"
    const selectBoxes: NodeListOf<Element> = document.querySelectorAll(".select-box");

    // Set up click event handling for select boxes
    setupSelectBoxClickHandling(selectBoxes);

    // Update selected options for the first custom select (assuming there's at least one)
    updateSelectedOptions(customSelects[0]);

    // Select the submit button with the class "btn_submit"
    const submitButton: Element | null = document.querySelector(".btn_submit");

    // Add a click event listener to the submit button to handle the click
    submitButton?.addEventListener("click", async function (): Promise<void> {
        // Use the async function handleButtonClick when the submit button is clicked
        handleButtonClick().then((result: string | null): void => {
            if (result !== null) {
                // Handle the valid result
                console.log(result);
            } else {
                // Handle the case where the input is not valid
                console.log("Input is not valid.");
            }
        });
    });


    const textarea: HTMLDivElement | null = document.querySelector(".question-body-textarea");
    const boldButton: HTMLButtonElement | null = document.querySelector(".bold");
    const italicButton: HTMLButtonElement | null = document.querySelector(".italic");
    const underlineButton: HTMLButtonElement | null = document.querySelector(".underline");
    const inlineCodeButton: HTMLButtonElement | null = document.querySelector(".inline-code");
    const codeBlockButton: HTMLButtonElement | null = document.querySelector(".code-block");
    const listButton: HTMLButtonElement | null = document.querySelector(".list");
    const colorPickerButton: HTMLButtonElement | null = document.querySelector(".color-picker");

    if (textarea) {
        boldButton?.addEventListener("click", () => {
            console.log(textarea);
            checkTextStyle(boldButton, textarea);
        });

        italicButton?.addEventListener("click", () => {
            checkTextStyle(italicButton, textarea);
        });

        underlineButton?.addEventListener("click", () => {
            checkTextStyle(underlineButton, textarea);
        });

        inlineCodeButton?.addEventListener("click", () => {
            checkTextStyle(inlineCodeButton, textarea);
        });

        codeBlockButton?.addEventListener("click", () => {
            checkTextStyle(codeBlockButton, textarea);
        });

        listButton?.addEventListener("click", () => {
            checkTextStyle(listButton, textarea);
        });

        colorPickerButton?.addEventListener("click", () => {
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
    const selectedConte: DocumentFragment = range.cloneContents();

    const beforeNice: string = getFullHtmlBeforeSelection(beforeSelectedRange);
    const afterNice: string = getFullHtmlAfterSelection(afterSelectedRange);

    console.log(beforeNice);
    console.log(selectedConte.textContent);
    console.log(afterNice);

    console.log("NEXT");




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



    const selected: string = selection.toString().trim();

    // get tekst before selected tekst
    const beforeSelected: Range = range.cloneRange();
    beforeSelected.selectNodeContents(textarea);
    beforeSelected.setEnd(range.startContainer, range.startOffset);
    const prefix: string = beforeSelected.toString().trim();

    // Get tekst after selected tekst.
    const afterSelected: Range = range.cloneRange();
    afterSelected.selectNodeContents(textarea);
    afterSelected.setStart(range.endContainer, range.endOffset);
    const suffix: string = afterSelected.toString().trim();


    switch (true) {
        case element.classList.contains("bold"):
            const bold: string = " <b>" + selected + "</b> ";

            textarea.innerHTML = prefix + bold + suffix;
            break;

        case element.classList.contains("italic"):
            const italic: string = " <i>" + selected + "</i> ";

            textarea.innerHTML = prefix + italic + suffix;
            break;

        case element.classList.contains("underline"):
            const underline: string = " <span style='text-decoration: underline'>" + selected + "</span> ";

            textarea.innerHTML = prefix + underline + suffix;
            break;

        case element.classList.contains("inline-code"):
            const inlineCode: string = " <code>" + selected + "</code> ";

            textarea.innerHTML = prefix + inlineCode + suffix;
            break;

        case element.classList.contains("code-block"):
            const codeBlock: string = " <code>" + selected + "</code> ";

            textarea.innerHTML = prefix + codeBlock + suffix;
            break;


        case element.classList.contains("list"):
            const list: string = " <ul><li>" + selected + "</li></ul> ";

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




