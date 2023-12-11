import "./config";

/**
 * The main application entry point for the single-question page.
 *
 * This function initializes the single-question page, including event handling,
 * user verification, and other related functionality.
 *
 * @returns {Promise<void>} A Promise that resolves when the application setup is complete.
 */
async function setup(): Promise<void> {

    const customSelects: NodeListOf<Element> = document.querySelectorAll(".custom-select");



    customSelects.forEach(item => {
        updateSelectedOptions(item);
    });

    customSelects.forEach(function (customSelect: Element) {
        const searchInput: HTMLInputElement | null = customSelect.querySelector(".search-tags");
        const optionsContainer: Element | null = customSelect.querySelector(".options");
        const noResultMessage: Element | null = customSelect.querySelector(".no-result-message");
        const allTagsOption: Element | null = customSelect.querySelector(".option.all-tags");
        const clearButton: Element | null = customSelect.querySelector(".clear");

        allTagsOption?.addEventListener("click", function () {
            const isActive: boolean = allTagsOption?.classList.contains("active");

            customSelect.querySelectorAll(".option").forEach(function (option: Element) {
                if (option !== allTagsOption) {
                    option.classList.toggle("active", !isActive);
                }
            });

            updateSelectedOptions(customSelect);
        });


        clearButton?.addEventListener("click", function () {
            if (searchInput) {
                searchInput.value = "";
            }
            customSelect.querySelectorAll(".option").forEach(function (option: Element): void {
                option.classList.add("block");
            });

            noResultMessage?.classList.add("hidden");
        });

        searchInput?.addEventListener("input", function () {
            const searchTerm: string = searchInput?.value.toLowerCase();
            console.log(searchTerm);

            customSelect.querySelectorAll(".option").forEach(function (option: Element): void {
                if (option.textContent) {
                    const optionText: string | null = option.textContent.trim();

                    const shouldShow: boolean = optionText.toLowerCase().includes(searchTerm);

                    if (shouldShow) {
                        if (option.classList.contains("hidden")) {
                            option.classList.remove("hidden");
                        }
                        option.classList.add("block");
                    }

                    if (!shouldShow) {
                        if (option.classList.contains("block")) {
                            option.classList.remove("block");
                        }
                        option.classList.add("hidden");
                    }
                }
            });
            const options: NodeListOf<Element> = customSelect.querySelectorAll(".option");

            const anyOptionsMatch: boolean = Array.from(options).some(option => option.classList.contains("block"));

            if (anyOptionsMatch) noResultMessage?.classList.add("hidden");
            if (!anyOptionsMatch) noResultMessage?.classList.add("block");

            if (searchTerm) {
                optionsContainer?.classList.add("option-search-active");
            } else {
                optionsContainer?.classList.remove("option-search-active");
            }

        });

    });


    customSelects.forEach(function (customSelect: Element) {
        customSelect.querySelectorAll(".option").forEach(function (option: Element): void {
            option.addEventListener("click", function (): void {
                option.classList.toggle("active");
                updateSelectedOptions(customSelect);
            });
        });
    });

    document.addEventListener("click", function (event ) {
        const elem: HTMLElement = event.target as HTMLElement;
        const removeTag: Element | null = elem.closest(".remove-tag");
        if (removeTag) {
            const customSelect: Element | null = removeTag.closest(".custom-select");
            if (customSelect) {
                const valueToRemove: string | null = removeTag.getAttribute("data-value");
                const optionToRemove: Element | null = customSelect?.querySelector(".option[data-value=\"" + valueToRemove + "\" ]");
                optionToRemove?.classList.remove("active");

                const otherSelectedOptions: NodeListOf<Element> = customSelect?.querySelectorAll(".option.active:not(.all-tags)");
                const allTagsOption: Element | null = customSelect?.querySelector(".option.all-tags");

                if (otherSelectedOptions.length === 0) {
                    allTagsOption?.classList.remove("active");
                }
                updateSelectedOptions(customSelect);
            }
        }
    });

    const selectBoxes: NodeListOf<Element> = document.querySelectorAll(".select-box");
    selectBoxes.forEach(function (selectBox: Element) {
        selectBox.addEventListener("click", function (event){
            const targetElem: HTMLElement = event.target as HTMLElement;
            const elem: HTMLElement = event.target as HTMLElement;
            if (!targetElem.closest(".tag") && elem.parentElement) {
                elem.parentElement.classList.toggle("open");
            }
        });
    });

    document.addEventListener("click", function (event: MouseEvent) {
        const targetElem: HTMLElement = event.target as HTMLElement;

        if (!targetElem.closest(".custom-select") && !targetElem.classList.contains("remove-tag")) {
            customSelects.forEach(function (customSelect: Element) {
                customSelect.classList.remove("open");
            });
        }
    });


    updateSelectedOptions(customSelects[0]);

    const submitButton: Element | null = document.querySelector(".btn_submit");
    submitButton?.addEventListener("click", function (): void {
        let valid: boolean = true;

        customSelects.forEach(function (customSelect: Element) {
            const selectedOptions: NodeListOf<Element> = customSelect.querySelectorAll(".option.active");

            if (selectedOptions.length === 0) {
                const tagErrorMsg: Element | null = customSelect.querySelector(".tag_error_msg");

                if (tagErrorMsg) {
                    tagErrorMsg.textContent = "This field is required!";
                    tagErrorMsg.classList.add("block");
                }

                valid = false;
            } else {
                const tagErrorMsg: Element | null = customSelect.querySelector(".tag_error_msg");

                if (tagErrorMsg) {
                    tagErrorMsg.textContent = "";
                    tagErrorMsg.classList.add("hidden");
                }
            }
        });

        if (valid) {
            let tags: HTMLInputElement = document.querySelector(".tags_input") as HTMLInputElement;

            console.log(tags);
            resetCustomSelects();
            return;
        }

    });
}

// Invoke the question detail page application entry point.
await setup();


function resetCustomSelects(): void {
    document.querySelectorAll(".custom-select").forEach(function (customSelect: Element) {
        customSelect.querySelectorAll(".option.active").forEach(function (option: Element) {
            option.classList.remove("active");
        });
        customSelect.querySelector(".option.all-tags")?.classList.remove("active");
        updateSelectedOptions(customSelect);
    });
}


function updateSelectedOptions(customSelect: any): void {
    const selectedOptions: any[] = Array.from(customSelect.querySelectorAll(".option.active")).filter(option => option !== customSelect.querySelector(".option.all-tags")).map(function (option: any): {
        text: any;
        value: any
    } {
        return {
            value: option.getAttribute("data-value"),
            text: option.textContent.trim()
        };
    });

    const selectedValues: any[] = selectedOptions.map(function (option: any) {
        return option.value;
    });

    customSelect.querySelector(".tags_input").value = selectedValues.join(", ");

    let tagsHtml: string  = "";

    if (selectedOptions.length === 0) {
        tagsHtml = "<span class=\"holder\">Select the tags</span>";
    } else {
        const maxTagsToShow: number = 4;
        let additionalTagsCount: number = 0;

        selectedOptions.forEach(function (option: any, index: number) {
            if (index < maxTagsToShow) {
                tagsHtml += "<span class=\"tag\">" + option.text + "<span class=\"remove-tag\" data-value=\"" + option.value + "\">&times;</span></span>";
            } else {
                additionalTagsCount++;
            }
        });

        if (additionalTagsCount > 0) {
            tagsHtml += "<span class=\"tag\"> " + additionalTagsCount + " </span>";
        }
    }

    customSelect.querySelector(".selected-options").innerHTML = tagsHtml;
}



