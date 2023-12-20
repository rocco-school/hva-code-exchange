import {delay} from "./delay";

/**
 * Display a success message with an optional duration.
 *
 * @param {string} message - The success message to display.
 * @param {number|null} duration - Optional duration for displaying the success message. If not provided, it defaults to 1000ms (1 second).
 * @param type - The type of which message to display.
 * @param extraID
 * @param typeOfId
 */
export async function showSuccessMessage(message: string, duration: number | null, type: string, extraID: number | null, typeOfId: string | null): Promise<void> {
    // Get references to HTML elements
    const filter: Element | null = document.querySelector(".filter");
    const messageButton: Element | null = document.querySelector(".continue-button");
    const CustomMessage: Element | null = document.querySelector(".message");
    const closeButton: Element | null = document.querySelector(".close-modal-button");
    const successIcon: Element | null = document.querySelector(".success-background");
    const failureIcon: Element | null = document.querySelector(".failed-background");
    const deleteIcon: Element | null = document.querySelector(".delete-background");

    successIcon?.classList.add("hidden", String(!successIcon?.classList.contains("hidden")));
    failureIcon?.classList.add("hidden", String(!failureIcon?.classList.contains("hidden")));
    deleteIcon?.classList.add("hidden", String(!deleteIcon?.classList.contains("hidden")));
    messageButton?.classList.add("hidden", String(!messageButton?.classList.contains("hidden")));
    closeButton?.classList.add("hidden", String(!closeButton?.classList.contains("hidden")));
    if (typeOfId) {
        messageButton?.classList.remove(typeOfId, String(!messageButton?.classList.contains(typeOfId)));
    }

    // Show the filter and hide the message button and success icon
    filter?.classList.remove("hidden");

    if (extraID && messageButton) {
        messageButton.id = extraID.toString();
    }

    switch (true) {
        case type === "success":
            successIcon?.classList.remove("hidden");
            break;
        case type === "danger":
            failureIcon?.classList.remove("hidden");
            break;
        case type === "delete":
            deleteIcon?.classList.remove("hidden");
            messageButton?.classList.remove("hidden");
            closeButton?.classList.remove("hidden");
            if (typeOfId) messageButton?.classList.add(typeOfId);
            break;
    }

    // Set the custom message content
    if (CustomMessage) {
        CustomMessage.innerHTML = message ?? "Successful!";
    }

    // Set a default duration if not provided
    if (!duration) {
        return;
    }

    await delay(duration);

    // Hide the success icon and filter, and show the message button
    filter?.classList.add("hidden");
}