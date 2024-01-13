import {CodingTag} from "../models/codingTag";

/**
 * Fetches the list of coding tags and populates the select options.
 *
 * @param {Element} optionsBody - The container element where the select options will be appended.
 * @returns {Promise<void>} - A Promise that resolves to undefined when the function completes.
 */
export async function populateTagSelect(optionsBody: Element): Promise<void> {
    // Fetch the list of coding tags from the server
    const codingTags: CodingTag[] | string = await CodingTag.getCodingTags();

    // If no coding tags were returned, return early
    if (codingTags.length === 0) return;

    // Iterate over each coding tag
    for (const codingTag of codingTags) {
        // Type assertion to ensure codingTag is an instance of CodingTag
        const tag: CodingTag = codingTag as CodingTag;

        // Create a new select option with the coding tag's name and id
        const newOption: string = "<div class=\"option\" tabindex=\"0\" data-value=\"" + tag.tagId + "\">" + tag.tagName + "</div>";

        // Append the new option to the options container
        optionsBody.innerHTML += newOption;
    }
}