// antHelpers

/**
 * transform '\r\n' and '\r' to '\n'
 * @param string
 */
export function normalize_newlines(string: string): string {
    return String(string).replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

/**
 * adds 4 spaces to all '\n'
 * @param string
 */
export function indent_codeblock(string: string): string {
    return '    ' + normalize_newlines(string).replace(/\n/g, '\n    ');
}

/**
 * Formats a string into a blockquote suitable for Markdown.
 * Each line of the string is prefixed with `> `, as per Markdown blockquote syntax.
 *
 * @param {string} string - The input string to format as a Markdown quote.
 * @returns {string} A string formatted as a Markdown blockquote.
 */
function quoteMarkdown(string: string): string {
    return '> ' + normalize_newlines(string).replace(/\n/g, '\n> ');
}

/**
 * Escapes special Markdown characters in a string to prevent formatting.
 * Characters escaped include: ~ ` > - \ [ ] ( ) # ^ & * _ ! <
 *
 * @param {string} string - The input string to escape for Markdown.
 * @returns {string} The escaped string, safe for Markdown rendering.
 */
function markdown_escape(string: string): string {
    return normalize_newlines(string).replace(/[~`>\-\\\[\]()#^&*_!<]/g, '\\$&');
}

/**
 * encodes a json with an indent
 * @param jsonicItem the item you want to jsonify
 * @param indent a number corresponding to indent, use true for 2
 * @param replacer JSON.stringify's replacer
 */
export function jsonEncode(jsonicItem: any, indent: boolean | number = false, replacer?: (this: any, key: string, value: any) => any): string {
    if (indent === false) return JSON.stringify(jsonicItem, replacer);
    else return JSON.stringify(jsonicItem, replacer, indent === true ? 2 : +indent);
}

/**
 * like jsonEncode but also adds 4 spaces to it
 * @param jsonicItem the json item to convert
 * @param indent a number corresponding to indent, use true for 2
 * @param replacer JSON.stringify's replacer
 */
export function jsonEncodeIndent(jsonicItem: any, indent: boolean | number = true, replacer?: (this: any, key: string, value: any) => any): string {
    return indent_codeblock(jsonEncode(jsonicItem, indent, replacer));
}
