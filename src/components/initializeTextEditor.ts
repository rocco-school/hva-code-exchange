export async function initializeTextEditor(): Promise<void> {
    // Selecting DOM elements
    let optionsButtons: NodeListOf<Element> = (<NodeListOf<Element>>document.querySelectorAll(".option-button"));
    let advancedOptionButton: NodeListOf<HTMLButtonElement> = (<NodeListOf<HTMLButtonElement>>document.querySelectorAll(".adv-option-button"));

    let fontName: HTMLElement = (<HTMLElement>document.getElementById("fontName"));
    let fontSizeRef: HTMLSelectElement = (<HTMLSelectElement>document.getElementById("fontSize"));
    let linkButton: HTMLButtonElement = (<HTMLButtonElement>document.getElementById("createLink"));
    let codeBlockButton: HTMLButtonElement = (<HTMLButtonElement>document.getElementById("codeBlock"));

    let alignButtons: NodeListOf<Element> = (<NodeListOf<Element>>document.querySelectorAll(".align"));
    let spacingButtons: NodeListOf<Element> = (<NodeListOf<Element>>document.querySelectorAll(".spacing"));
    let formatButtons: NodeListOf<Element> = (<NodeListOf<Element>>document.querySelectorAll(".format"));
    let scriptButtons: NodeListOf<Element> = (<NodeListOf<Element>>document.querySelectorAll(".script"));

    // List of available fonts
    let fontList: string[] = [
        "Arial",
        "Verdana",
        "Times New Roman",
        "Garamond",
        "Georgia",
        "Courier New",
        "Cursive",
    ];


    // Highlight certain buttons based on their category
    highlighter(alignButtons, true);
    highlighter(spacingButtons, true);
    highlighter(formatButtons, false);
    highlighter(scriptButtons, true);

    // Populate font select dropdown
    fontList.map((value: string): void => {
        let option: HTMLOptionElement = (<HTMLOptionElement>document.createElement("option"));
        option.value = value;
        option.innerHTML = value;
        fontName?.appendChild(option);
    });

    // Populate font size select dropdown
    for (let i: number = 1; i <= 7; i++) {
        let option: HTMLOptionElement = (<HTMLOptionElement>document.createElement("option"));
        option.value = i.toString();
        option.innerHTML = i.toString();
        fontSizeRef?.appendChild(option);
    }

    // Set default font size value
    fontSizeRef.value = "3";

    // Add click event listeners for standard buttons
    optionsButtons.forEach((button: Element): void => {
        button.addEventListener("click", (): void => {
            modifyText(button.id, false, undefined);
        });
    });

    // Add change event listeners for advanced option buttons
    advancedOptionButton.forEach((button: HTMLButtonElement): void => {
        button.addEventListener("change", (): void => {
            modifyText(button.id, false, button.value);
        });
    });

    // Add click event listener for creating links
    linkButton.addEventListener("click", (): void => {
        let userLink: string = prompt("Enter a URL?") as string;
        if (/http/i.test(userLink)) {
            modifyText(linkButton.id, false, userLink);
        } else {
            userLink = "http://" + userLink;
            modifyText(linkButton.id, false, userLink);
        }
    });

    // Add event listener for the codeBlock button
    if (codeBlockButton) {
        codeBlockButton.addEventListener("click", (): void => {
            const selection: Selection = window.getSelection() as Selection;

            if (selection) {
                const range: Range = (<Range>selection.getRangeAt(0));

                if (range) {
                    const parentCodeBlock: HTMLElement = (<HTMLElement>findParentCodeBlock(range.commonAncestorContainer));

                    if (parentCodeBlock) {
                        // Case 3: If the cursor is inside a code block, unwrap the content
                        unwrapCodeBlock(parentCodeBlock);
                    } else if (selection.toString().trim() !== "") {
                        // Case 1: If text is selected, wrap it with a code block
                        modifyText("insertHTML", false, `<div class="code-block">${selection.toString()}</div>`);
                    } else {
                        // Case 2: If no text is selected, insert a new line with a code block
                        insertCodeBlock();
                    }
                }
            }
        });
    }
}


/**
 * Modifies the text content using document.execCommand.
 *
 * @param {string} command - The command to execute using document.execCommand.
 * @param {boolean} defaultUi - A boolean indicating whether the default UI should be used.
 * @param {any} value - The value to pass to document.execCommand.
 * @returns {void}
 */
function modifyText(command: string, defaultUi: boolean | undefined, value: string | undefined): void {
    // Execute the specified command on the current document's selection
    document.execCommand(command, defaultUi, value);
}

/**
 * Finds the parent <code> block of a given node in the DOM.
 *
 * @param {Node} node - The node for which to find the parent <code> block.
 * @returns {HTMLElement | null} - The parent <code> block element or null if not found.
 */
function findParentCodeBlock(node: Node): HTMLElement | null {
    /**
     * Checks if the provided node is a <code> block element.
     *
     * @param {Node} element - The node to check.
     * @returns {boolean} - True if the node is a <code> block element, false otherwise.
     */
    const isCodeBlock: (element: Node) => (boolean | null) = (element: Node): boolean | null => {
        return element.parentElement && (element.parentElement.classList.contains("code-block") || element.parentElement.tagName === "SPAN");
    };

    let current: Node = node;

    // Check if the current node is a <code> or <span> block element
    if (isCodeBlock(current)) {
        return current.parentElement;
    }

    // Traverse up the DOM tree to find the nearest <code> or <span> block element
    while (current.parentElement) {
        current = current.parentElement;

        // Check if the current node is a <code> or <span> block element
        if (isCodeBlock(current)) {
            return current.parentElement;
        }
    }

    return null;
}

/**
 * Unwraps content from a <code> block and replaces it with a text node.
 *
 * @param {HTMLElement} codeBlock - The <code> block element to unwrap.
 * @returns {void}
 */
function unwrapCodeBlock(codeBlock: HTMLElement): void {

    /**
     * Creates a text node from the content of the provided <code> block.
     *
     * @param {HTMLElement} block - The <code> block element.
     * @returns {Text} - The created text node.
     */
    const createTextNodeFromCodeBlock: (block: HTMLElement) => Text = (block: HTMLElement): Text => {
        return (<Text>document.createTextNode(block.textContent!));


    };

    // Create a text node from the content of the code block
    const codeContent: Text = createTextNodeFromCodeBlock(codeBlock);

    if (codeBlock.tagName === "SPAN") {
        codeBlock.replaceWith(codeContent);
        return;
    }

    // Get the parent element of the code block
    if (codeBlock.parentElement && codeBlock.parentElement.id !== "text-input") {
        // Replace the parent element (including the code block) with the text node
        codeBlock.parentElement.replaceWith(codeContent);
    }
}

/**
 * Inserts a <code> block at the current selection in the document.
 *
 * @returns {void}
 */
function insertCodeBlock(): void {
    /**
     * Creates a <code> block with default content.
     *
     * @returns {HTMLPreElement} - The created <code> block.
     */
    const createCodeBlock: () => HTMLElement = (): HTMLElement => {
        const codeBlock: HTMLElement = (<HTMLElement>document.createElement("div"));
        codeBlock.classList.add("code-block");
        codeBlock.textContent = "Put your code here";
        return codeBlock;
    };

    // Get the current text selection
    const selection: Selection = (<Selection>window.getSelection());

    if (selection) {
        // Get the range of the selection
        const range: Range = (<Range>selection.getRangeAt(0));

        if (range) {
            // Create a <code> block with default content
            const codeBlock: HTMLElement = createCodeBlock();

            // Replace the selected contents with the <code> block
            range.deleteContents();
            range.insertNode(codeBlock);

            // Set focus on the new code block for better usability
            codeBlock.focus();
        }
    }
}

/**
 * Adds click event listeners to elements with the specified class names for highlighting.
 *
 * @param {Array} className - An array of elements or class names to add click event listeners to.
 * @param {boolean} needsRemoval - A flag indicating whether to remove the "active" class from other elements.
 * @returns {void}
 */
function highlighter(className: any[] | NodeListOf<Element>, needsRemoval: boolean): void {
    // Iterate through each element or class name in the array
    className.forEach((button) => {
        // Add a click event listener to the current element or class name
        button.addEventListener("click", () => {
            // Check if "needsRemoval" flag is set
            if (needsRemoval) {
                let alreadyActive: boolean = false;

                // Check if the current element already has the "active" class
                if (button.classList.contains("active")) {
                    alreadyActive = true;
                }

                // Remove the "active" class from all elements in the array
                highlighterRemover(className);

                // Add the "active" class back to the clicked element if it wasn't already active
                if (!alreadyActive) {
                    button.classList.add("active");
                }
            } else {
                // Toggle the "active" class on the clicked element
                button.classList.toggle("active");
            }
        });
    });
}

/**
 * Removes the "active" class from the elements with the specified class names.
 *
 * @param {Array} classNames - An array of elements or class names to remove the "active" class from.
 * @returns {void}
 */
function highlighterRemover(classNames: any[] | NodeListOf<Element>): void {
    /**
     * Remove the "active" class from the provided element or class name.
     *
     * @param {Element} button - The HTML element or class name.
     * @returns {void}
     */
    const removeActiveClass: (button: Element) => void = (button: Element): void => {
        button.classList.remove("active");
    };

    // Iterate through each element or class name in the array
    classNames.forEach((button): void => {
        // Remove the "active" class from the current element or class name
        removeActiveClass(button);
    });
}