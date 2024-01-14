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
    const filter: HTMLElement = document.querySelector(".filter") as HTMLElement;
    const messageButton: HTMLElement = document.querySelector(".continue-button") as HTMLElement;
    const CustomMessage: HTMLElement = document.querySelector(".message") as HTMLElement;
    const closeButton: HTMLElement = document.querySelector(".close-modal-button") as HTMLElement;
    const successIcon: HTMLElement = document.querySelector(".success-background") as HTMLElement;
    const failureIcon: HTMLElement = document.querySelector(".failed-background") as HTMLElement;
    const deleteIcon: HTMLElement = document.querySelector(".delete-background") as HTMLElement;

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

    if (closeButton) {
        closeButton.addEventListener("click", (): void => {
            filter?.classList.add("hidden");
        });
    }

    // Use a switch statement based on the truthiness of the expression 'type === "success"', 'type === "danger"'.
    switch (true) {
        // Case: Show success icon
        case type === "success":
            successIcon?.classList.remove("hidden");
            break;

        // Case: Show danger (failure) icon
        case type === "danger":
            failureIcon?.classList.remove("hidden");
            break;

        // Case: Show delete icon, message button, and close button
        case type === "delete":
            deleteIcon?.classList.remove("hidden");
            messageButton?.classList.remove("hidden");
            closeButton?.classList.remove("hidden");

            // If 'typeOfId' is truthy, add it as a class to 'messageButton'
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