import "./config";
import {
    addClickListenersToOptions,
    handleButtonClick,
    handleDocumentClick,
    setupCustomSelect,
    setupSelectBoxClickHandling,
    updateSelectedOptions
} from "./components/customSelect";

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

}

// Invoke the question detail page application entry point.
await setup();


async function populateTagSelect(optionsBody: Element): Promise<void> {

    const newOption: string = "<div class=\"option\" data-value=\"Black\">Black</div>";

    optionsBody.innerHTML += newOption;
}




