
export function removeHTMLTagsAndExtraWhitespace(str: string): string {
    return str.replace(/<[^>]*>/g, "").replace(/\s+/g, " ");
}