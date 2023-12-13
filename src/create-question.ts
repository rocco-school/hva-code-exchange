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



    const textarea: HTMLTextAreaElement = document.querySelector(".question-body-textarea");
    const boldButton: HTMLElement | null = document.querySelector(".bold-button");
    const italicButton: HTMLButtonElement | null = document.querySelector(".italic-button");
    const underlineButton: HTMLButtonElement | null = document.querySelector(".underline-button");
    const inlineCodeButton: HTMLButtonElement | null = document.querySelector(".inline-code-button");
    const codeBlockButton: HTMLButtonElement | null = document.querySelector(".code-block-button");

    boldButton?.addEventListener("click", function (): void {
        const selected: string = textarea.value.substr(textarea.selectionStart, textarea.selectionEnd - textarea.selectionStart).trim();

        if (selected) {
            const prefix: string = textarea.value.slice(0, textarea.selectionStart);
            const suffix: string = textarea.value.slice(textarea.selectionEnd, textarea.value.length);

            const bold: string = "<b>" + selected + "</b>";
            const italic: string = "<i>" + selected + "</i>";
            const underline: string = "*" + selected + "*";
            const inlineCode: string = "<code>" + selected + "</code>";

            textarea.value = prefix + italic + suffix;
        }



    });




    //
    //
    // function f1(e): void {
    //     let value: string = e.value;
    //     textarea.style.fontSize = value + "px";
    // }
    // function f2(e): void {
    //     if (textarea.style.fontWeight === "bold") {
    //         textarea.style.fontWeight = "normal";
    //         e.classList.remove("active");
    //     }
    //     else {
    //         textarea.style.fontWeight = "bold";
    //         e.classList.add("active");
    //     }
    // }
    // function f3(e): void {
    //     if (textarea.style.fontStyle === "italic") {
    //         textarea.style.fontStyle = "normal";
    //         e.classList.remove("active");
    //     }
    //     else {
    //         textarea.style.fontStyle = "italic";
    //         e.classList.add("active");
    //     }
    // }
    // function f4(e): void {
    //     if (textarea.style.textDecoration === "underline") {
    //         textarea.style.textDecoration = "none";
    //         e.classList.remove("active");
    //     }
    //     else {
    //         textarea.style.textDecoration = "underline";
    //         e.classList.add("active");
    //     }
    // }
    // function f5(e): void {
    //     textarea.style.textAlign = "left";
    // }
    // function f6(e): void {
    //     textarea.style.textAlign = "center";
    // }
    // function f7(e): void {
    //     textarea.style.textAlign = "right";
    // }
    // function f8(e): void {
    //     if (textarea.style.textTransform === "uppercase") {
    //         textarea.style.textTransform = "none";
    //         e.classList.remove("active");
    //     }
    //     else {
    //         textarea.style.textTransform = "uppercase";
    //         e.classList.add("active");
    //     }
    // }
    // function f9(): void {
    //     textarea.style.fontWeight = "normal";
    //     textarea.style.textAlign = "left";
    //     textarea.style.fontStyle = "normal";
    //     textarea.style.textTransform = "capitalize";
    //     textarea.value = "";
    // }
    // function f10(e): void {
    //     textarea.style.color = e.value;
    // }
    // window.addEventListener("load", (): void => {
    //     textarea.value = "";
    // });








}

// Invoke the question detail page application entry point.
await setup();

async function populateTagSelect(optionsBody: Element): Promise<void> {
    const codingTags: CodingTag[] | string = await CodingTag.getCodingTags();

    if (codingTags.length === 0) return;

    for (const codingTag of codingTags) {
        const tag: CodingTag = codingTag as CodingTag;

        const newOption: string = "<div class=\"option\" data-value=\"" + tag.tagId + "\">" + tag.tagName + "</div>";
        optionsBody.innerHTML += newOption;
    }
}




