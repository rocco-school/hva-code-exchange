import {
    addClickListenersToOptions,
    handleDocumentClick,
    setupCustomSelect,
    setupSelectBoxClickHandling,
    updateSelectedOptions
} from "./customSelect";
import {populateTagSelect} from "./handleCustomSelect";

/**
 * Fetches the list of coding tags and populates the select options.
 *
 * @returns {Promise<void>} A Promise that resolves when the function completes successfully.
 */
export async function initializeTagSelect(): Promise<void> {
    const customSelects: NodeListOf<Element> = (<NodeListOf<Element>>document.querySelectorAll(".custom-select"));
    const selectBoxes: NodeListOf<Element> = (<NodeListOf<Element>>document.querySelectorAll(".select-box"));
    const selectOptions: HTMLElement = (<HTMLElement>document.querySelector(".options"));

    if (selectOptions) await populateTagSelect(selectOptions);

    // Update selected options for each custom select
    customSelects.forEach(updateSelectedOptions);

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
}