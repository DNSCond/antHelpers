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
 * @param jsonicItem
 * @param indent
 * @param replacer
 */
export function jsonEncodeIndent(jsonicItem: any, indent: boolean | number = true, replacer?: (this: any, key: string, value: any) => any): string {
    return indent_codeblock(jsonEncode(jsonicItem, indent, replacer));
}
