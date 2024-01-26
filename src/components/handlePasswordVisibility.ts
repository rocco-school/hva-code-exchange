/**
 * Toggle password visibility on icon click.
 * @param {Element} icon - The icon element to attach the click event to.
 */
export function togglePasswordVisibility(icon: Element): void {
    icon.addEventListener("click", (): void => {
        // Find the closest ancestor with class "passwordBox"
        const passwordBox: Element = icon.closest(".passwordBox") as Element;

        // Find the input element within the passwordBox
        const inputElem: HTMLInputElement = passwordBox?.querySelector(".inputBox") as HTMLInputElement;

        // Check if the input element is of type "password"
        if (inputElem && inputElem.type === "password") {
            // If it's a password input, change type to "text"
            inputElem.type = "text";
            icon.classList.replace("fa-eye-slash", "fa-eye");
        } else {
            // If it's not a password input or doesn't exist, change type to "password"
            inputElem.type = "password";
            icon.classList.replace("fa-eye", "fa-eye-slash");
        }
    });
}