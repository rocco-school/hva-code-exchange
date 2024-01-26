/**
 * Adds click event listeners to all options within a custom select.
 *
 * @param {Element} customSelect - The custom select element.
 */
export function addClickListenersToOptions(customSelect: Element): void {
    /**
     * Click event handler for individual options within the custom select.
     *
     * @param {Event} event - The click event.
     */
    function optionClickHandler(event: Event): void {
        const option: Element = event.target as Element;
        option.classList.toggle("active");
        updateSelectedOptions(customSelect);
    }

    // Add click event listeners to all options within the custom select

    (<NodeListOf<Element>>document.querySelectorAll(".option")).forEach(function (option: Element): void {
        option.addEventListener("click", optionClickHandler);

        // Event listener for keydown event (e.g., Enter key)
        option.addEventListener("keydown", (event: Event) => {
            const keyDown: KeyboardEvent = event as KeyboardEvent;
            if (keyDown.key === "Enter") {
                optionClickHandler(event);
            }
        });


    });
}

/**
 * Sets up event listeners and functionality for a custom select.
 *
 * @param {Element} customSelect - The custom select element.
 */
export function setupCustomSelect(customSelect: Element): void {
    // Retrieve necessary elements within the custom select
    const searchInput: HTMLInputElement = (<HTMLInputElement>document.querySelector(".search-tags"));
    const optionsContainer: HTMLDivElement = (<HTMLDivElement>document.querySelector(".options"));
    const noResultMessage: HTMLDivElement = (<HTMLDivElement>document.querySelector(".no-result-message"));
    const allTagsOption: HTMLDivElement = (<HTMLDivElement>document.querySelector(".option.all-tags"));
    const clearButton: HTMLButtonElement = (<HTMLButtonElement>document.querySelector(".clear"));

    // Event listener for 'All Tags' option click
    allTagsOption.addEventListener("click", function (): void {
        toggleAllTagsOption(customSelect);
    });

    // Event listener for keydown event (e.g., Enter key) on 'All Tags' option
    allTagsOption.addEventListener("keydown", function (event: KeyboardEvent): void {
        if (event.key === "Enter") {
            toggleAllTagsOption(customSelect);
        }
    });

    // Event listener for 'Clear' button
    clearButton.addEventListener("click", function (): void {
        clearSearchInput(searchInput, customSelect, noResultMessage);
    });

    // Event listener for keydown event (e.g., Enter key)
    clearButton.addEventListener("keydown", function (event: KeyboardEvent): void {
        if (event.key === "Enter") {
            clearSearchInput(searchInput, customSelect, noResultMessage);
        }
    });

    // Event listener for search input
    searchInput.addEventListener("input", (): void => {
        handleSearchInput(searchInput, customSelect, noResultMessage, optionsContainer);
    });
}


/**
 * Toggles the 'active' class for all options, including the 'All Tags' option.
 *
 * @param {Element} customSelect - The custom select element.
 */
function toggleAllTagsOption(customSelect: Element): void {
    // Toggle 'active' class for all options (including 'All Tags')
    (<NodeListOf<Element>>customSelect.querySelectorAll(".option")).forEach(function (option: Element): void {
        option.classList.toggle("active");
    });

    // Update the selected options display
    updateSelectedOptions(customSelect);
}

/**
 * Clears the search input and resets the options display.
 *
 * @param {HTMLInputElement} searchInput - The search input element.
 * @param {Element} customSelect - The custom select element.
 * @param {Element} noResultMessage - The element to display when there are no search results.
 */
function clearSearchInput(
    searchInput: HTMLInputElement,
    customSelect: Element,
    noResultMessage: Element
): void {
    if (!searchInput) return;

    // Clear the search input value
    searchInput.value = "";

    // Show all options and hide 'No Result' message
    (<NodeListOf<Element>>customSelect.querySelectorAll(".option")).forEach(function (option: Element): void {
        option.classList.add("block");
        option.classList.remove("hidden");
    });

    if (noResultMessage) {
        noResultMessage.classList.add("hidden");
        noResultMessage.classList.remove("block");

    }
}


/**
 * Handles the input event on a search input, filtering options in a custom select.
 *
 * @param {HTMLInputElement} searchInput - The search input element.
 * @param {Element} customSelect - The custom select element.
 * @param {Element} noResultMessage - The element to display when there are no search results.
 * @param {HTMLDivElement} optionsContainer - The container for the options.
 */
function handleSearchInput(
    searchInput: HTMLInputElement,
    customSelect: Element,
    noResultMessage: Element,
    optionsContainer: HTMLDivElement
): void {
    // Check if any required elements are missing
    if (!searchInput || !customSelect || !noResultMessage || !optionsContainer) return;

    // Get the lowercase search term
    const searchTerm: string = searchInput.value.toLowerCase();

    // Filter options based on the search term
    (<NodeListOf<Element>>customSelect.querySelectorAll(".option")).forEach(function (option: Element): void {
        if (option.textContent) {
            const optionText: string = option.textContent.trim();
            const shouldShow: boolean = optionText.toLowerCase().includes(searchTerm);

            // Show or hide options based on the search result
            if (shouldShow) {
                if (option.classList.contains("hidden")) {
                    option.classList.remove("hidden");
                }
                option.classList.add("block");
            } else {
                if (option.classList.contains("block")) {
                    option.classList.remove("block");
                }
                option.classList.add("hidden");
            }
        }
    });

    // Check if any options match the search term


    const options: NodeListOf<Element> = (<NodeListOf<Element>>customSelect.querySelectorAll(".option"));
    const anyOptionsMatch: boolean = Array.from(options).some(option => option.classList.contains("block"));

    // Show or hide 'No Result' message based on search results
    if (anyOptionsMatch) {
        noResultMessage.classList.remove("block");
        noResultMessage.classList.add("hidden");
    }

    if (!anyOptionsMatch) {
        noResultMessage.classList.remove("hidden");
        noResultMessage.classList.add("block");
    }

    // Toggle class based on whether there's a search term
    if (searchTerm) {
        optionsContainer.classList.add("option-search-active");
    } else {
        optionsContainer.classList.remove("option-search-active");
    }
}


/**
 * Handles click events on the document to manage custom select elements and remove tags.
 *
 * @param {MouseEvent} event - The click event.
 */
export function handleDocumentClick(event: MouseEvent): void {
    const targetElem: HTMLElement = event.target as HTMLElement;
    const removeTag: HTMLElement = (<HTMLElement>targetElem.closest(".remove-tag"));
    const customSelect: HTMLElement = (<HTMLElement>targetElem.closest(".custom-select"));

    // Handle removing tags
    if (removeTag && customSelect) {
        const valueToRemove: string = removeTag.getAttribute("data-value") as string;
        const optionToRemove: HTMLElement = (<HTMLElement>customSelect.querySelector(`.option[data-value="${valueToRemove}"]`));
        const otherSelectedOptions: NodeListOf<Element> = (<NodeListOf<Element>>customSelect.querySelectorAll(".option.active:not(.all-tags)"));
        const allTagsOption: HTMLElement = (<HTMLElement>customSelect.querySelector(".option.all-tags"));

        // Remove 'active' class from the selected option
        optionToRemove?.classList.remove("active");

        // Remove 'active' class from 'all-tags' option if no other options are selected
        if (otherSelectedOptions.length === 0) {
            allTagsOption?.classList.remove("active");
        }

        // Update the display of selected options
        updateSelectedOptions(customSelect);
    }
}


/**
 * Handles click events on select boxes, toggling the "open" class if necessary.
 *
 * @param {NodeListOf<Element>} selectBoxes - The select box elements to attach click event listeners to.
 */
export function setupSelectBoxClickHandling(selectBoxes: NodeListOf<Element>): void {
    /**
     * Click event handler for select boxes, toggling the "open" class if necessary.
     *
     * @param {Event} event - The click event.
     */
    function selectBoxClickHandler(event: MouseEvent | KeyboardEvent): void {
        if (event.type === "click" || (event.type === "keydown" && (event as KeyboardEvent).key === "Enter")) {
            const targetElem: HTMLElement = event.target as HTMLElement;

            // Check if the clicked element is not inside a ".tag" element
            if (!targetElem.closest(".tag")) {
                const parentElem: HTMLElement | null = targetElem.parentElement;
                if (parentElem) {
                    parentElem.classList.toggle("open");
                }
            }

            if (targetElem.classList.contains("open-select-box")) {
                const customSelect: HTMLElement = (<HTMLElement>document.querySelector(".custom-select"));

                if (customSelect) {
                    customSelect.classList.toggle("open");
                }
            }
        }
    }

    // Add click event listeners to all select boxes
    selectBoxes.forEach(function (selectBox: Element): void {
        const select: HTMLDivElement = selectBox as HTMLDivElement;
        select.addEventListener("click", selectBoxClickHandler);
        select.addEventListener("keydown", selectBoxClickHandler);
    });
}


/**
 * Validates the selected options in custom select elements.
 *
 * @param {NodeListOf<Element>} customSelects - The custom select elements to validate.
 * @returns {boolean} - Whether all custom selects are valid.
 */
export function validateCustomSelects(customSelects: NodeListOf<Element>): boolean {
    /**
     * Validates the selected options in a single custom select element.
     *
     * @param {Element} customSelect - The custom select element to validate.
     */
    function validateCustomSelect(customSelect: Element): void {
        const selectedOptions: NodeListOf<Element> = (<NodeListOf<Element>>customSelect.querySelectorAll(".option.active"));
        const tagErrorMsg: HTMLElement = (<HTMLElement>customSelect.querySelector(".tag_error_msg"));

        if (selectedOptions.length === 0) {
            // Show error message if no options are selected
            if (tagErrorMsg) {
                tagErrorMsg.textContent = "This field is required!";
                tagErrorMsg.classList.add("block");
            }

            isValid = false;
        } else {
            // Hide error message if options are selected
            if (tagErrorMsg) {
                tagErrorMsg.textContent = "";
                tagErrorMsg.classList.add("hidden");
            }
        }
    }

    let isValid: boolean = true;

    // Validate each custom select
    customSelects.forEach(validateCustomSelect);

    return isValid;
}

/**
 * Handles the click event of the submit button.
 *
 * @returns {Promise<string | null>} - A promise that resolves with the tagsInput.value or null.
 */
export function handleButtonClick(): Promise<string | null> {
    return new Promise((resolve): void => {
        const customSelects: NodeListOf<Element> = (<NodeListOf<Element>>document.querySelectorAll(".custom-select"));
        const isValid: boolean = validateCustomSelects(customSelects);

        if (isValid) {
            const tagsInput: HTMLInputElement = (<HTMLInputElement>document.querySelector(".tags_input"));
            const customSelectInput: string = tagsInput.value;
            resetCustomSelects();

            // Resolve the promise with the result
            resolve(customSelectInput);
        } else {
            // Resolve the promise with null if not valid
            resolve(null);
        }
    });
}

/**
 * Resets all custom select components by removing the 'active' class from selected options
 * and updating the display of selected options.
 *
 * @returns {void}
 */
export function resetCustomSelects(): void {
    // Find all custom select elements
    (<NodeListOf<Element>>document.querySelectorAll(".custom-select")).forEach(function (customSelect: Element) {
        // Remove 'active' class from all selected options

        (<NodeListOf<Element>>customSelect.querySelectorAll(".option")).forEach(function (option: Element) {
            option.classList.remove("active");
        });

        // Remove 'active' class from the special 'all-tags' option, if it exists
        (<HTMLDivElement>customSelect.querySelector(".option.all-tags")).classList.remove("active");

        // Update the display of selected options
        updateSelectedOptions(customSelect);
    });
}

/**
 * Updates the selected options in a custom select component.
 *
 * @param {Element} customSelect - The custom select element.
 * @returns {void}
 */
export function updateSelectedOptions(customSelect: Element): void {
    // Find all selected options and extract their text and value attributes
    const selectedOptions: any[] = Array.from((<NodeListOf<Element>>customSelect.querySelectorAll(".option.active")))
        .filter(option => option !== (<HTMLDivElement>customSelect.querySelector(".option.all-tags")))
        .map(function (option: any) {
            return {
                value: option.getAttribute("data-value"),
                text: option.textContent.trim()
            };
        });

    // Extract values from selected options
    const selectedValues: any[] = selectedOptions.map(function (option) {
        return option.value;
    });

    const tagInput: HTMLInputElement = (<HTMLInputElement>customSelect.querySelector(".tags_input"));

    if (tagInput) {
        // Set the selected values in the tags input
        tagInput.value = selectedValues.join(", ");
    }

    let tagsHtml: string = "";

    // Generate HTML for displaying selected tags
    if (selectedOptions.length === 0) {
        tagsHtml = "<span class=\"holder open-select-box\">Select the tags</span>";
    } else {
        const maxTagsToShow: number = 4;
        let additionalTagsCount: number = 0;

        // Iterate over selected options to generate tag HTML
        selectedOptions.forEach(function (option, index): void {
            if (index < maxTagsToShow) {
                tagsHtml += "<span class=\"tag\">" + option.text + "<span class=\"remove-tag\" data-value=\"" + option.value + "\">&times;</span></span>";
            } else {
                additionalTagsCount++;
            }
        });

        // Display count for additional tags if any
        if (additionalTagsCount > 0) {
            tagsHtml += "<span class=\"tag\"> " + additionalTagsCount + "&plus; </span>";
        }
    }

    const selectOptions: HTMLElement = (<HTMLElement>customSelect.querySelector(".selected-options"));

    if (selectOptions) {
        // Update the HTML content to display selected tags
        selectOptions.innerHTML = tagsHtml;
    }
}