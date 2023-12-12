/**
 * Redirects the user to the specified URL using the `window.location.replace` method.
 * @param {string} target - The URL to which the user should be redirected.
 * @returns {void}
 */
export function redirect(target: string): void {
    // Use the window.location.replace method to perform the redirect.
    window.location.href = target;
}
