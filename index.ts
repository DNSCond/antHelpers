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
export function quoteMarkdown(string: string): string {
    return '> ' + normalize_newlines(string).replace(/\n/g, '\n> ');
}

/**
 * Escapes special Markdown characters in a string to prevent formatting.
 * Characters escaped include: ~ ` > - \ [ ] ( ) # ^ & * _ ! <
 *
 * @param {string} string - The input string to escape for Markdown.
 * @reexport returns {string} The escaped string, safe for Markdown rendering.
 */
export function markdown_escape(string: string): string {
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

// CustomError
export class CustomError<T = unknown> extends Error {
    detail: T;

    constructor(message: string, detail: T) {
        super(message);
        this.detail = detail;
        this.name = new.target?.name ?? 'CustomError';
    }

    get [Symbol.toStringTag]() {
        return this.name;
    }

    static [Symbol.toStringTag] = "CustomError";
}

export type EXMAScript_primitive = string | number | null | undefined | bigint | symbol | boolean;

export const EXMAScript = Object.freeze({
    __proto__: {
        [Symbol.toStringTag]: 'EXMAScriptInternals',
    }, toIntegerOrInfinity(n: any): number {
        n = +n;
        if (Object.is(n, NaN) || n === 0) {
            return 0;
        } else return Math.trunc(n);
    }, OrdinaryToPrimitive(mixed: any, hint: "string" | "number" = "number"): EXMAScript_primitive {
        if (!["string", "number"].includes(hint)) throw new TypeError('incorrect hint');
        if (!isObject(mixed)) return mixed;
        const methodNames = hint === "string" ? ["toString", "valueOf"] : ["valueOf", "toString"];
        for (let methodName of methodNames) {
            if (methodName in mixed) {
                if (typeof mixed[methodName] === "function") {
                    const primitive = mixed[methodName]();
                    if (!isObject(primitive)) return primitive;
                }
            }
        }
        throw new TypeError('could not convert to Primitive');
    }, toPrimitive(value: any, hint: "string" | "number" | "default"): EXMAScript_primitive {
        if (!["string", "number",  "default"].includes(hint)) throw new TypeError('incorrect hint');
        let primitive;
        if (value === null) return "null";
        if (typeof value === "object" || typeof value === "function") {
            if (Symbol.toPrimitive in value && typeof value[Symbol.toPrimitive] === "function") {
                primitive = value[Symbol.toPrimitive](hint);
                if (isObject(primitive)) throw new TypeError('could not convert to primitive');
            } else {
                primitive = EXMAScript.OrdinaryToPrimitive(value, "string");
            }
        } else primitive = value;
        return primitive;
    }, toPropertyKey(value: any): string | symbol {
        const primitive = EXMAScript.toPrimitive(value, "string");
        if (typeof primitive === "symbol") return primitive;
        return String(primitive);
    }, toNumeric(value: any): number | bigint | null {
        // Handle object conversion
        value = EXMAScript.toPrimitive(value, "number");
        if (typeof value === 'bigint') return value;
        else return +value;
    }, isNaN(nan: any): boolean {
        return isNaN(nan);
    }, webBuiltins: Object.freeze({
        [Symbol.toStringTag]: 'WebInternals',
        TokenList: class TokenList {
            #tokens: Set<string>;

            constructor(array: string[]) {
                this.#tokens = new Set(Array.from(array, s => `${s}`));
            }

            [Symbol.toStringTag] = 'TokenList';

            toString(): string {
                return Array.prototype.join.call(Array.from(this.#tokens.keys()), ' ');
            }

            add(...tokens: string[]) {
                Array.from(tokens).forEach(s => this.#tokens.add(this._validateToken(s)));
            }

            contains(token: string) {
                return this.#tokens.has(token);
            }

            remove(...tokens: string[]) {
                Array.from(tokens).forEach(s => this.#tokens.delete(this._validateToken(s)));
            }

            toggle(token: string, force: undefined | boolean = undefined) {
                token = this._validateToken(token);
                if (this.contains(token)) {
                    if (force === false || force === undefined) {
                        this.remove(token);
                        return false;
                    }
                    if (force) {
                        this.add(token);
                        return true;
                    }
                }
            }

            _validateToken(token: string) {
                token = `${token}`;
                if (token === '') {
                    throw new EXMAScript.webBuiltins.SyntaxError('token is empty');
                } else if (/\s+/.test(token)) {
                    throw new EXMAScript.webBuiltins.InvalidCharacterError('token is contains whitespace');
                }
                return token;
            }

            replace(oldToken: string, newToken: string) {
                oldToken = this._validateToken(oldToken);
                newToken = this._validateToken(newToken);
                if (this.contains(oldToken)) {
                    this.remove(oldToken);
                    this.remove(newToken);
                    return true;
                }
                return false;
            }

            get value() {
                return this.toString();
            }

            get length() {
                return this.#tokens.size;
            }
        },
        SyntaxError: class extends CustomError {
            constructor(m: string) {
                super(m, '"SyntaxError" DOMException');
            }
        },
        InvalidCharacterError: class extends CustomError {
            constructor(m: string) {
                super(m, '"InvalidCharacterError" DOMException');
            }
        },
    }),
});

export function ResolveSecondsAfterNow(s: number = 0): Date {
    return new Date((new Date).setMilliseconds(0) + (+s) * 1000);
}

export function ResolveSecondsAfter(s: number = 0, now?: Date | string | number): Date {
    return new Date((new Date(now ?? Date.now())).setMilliseconds(0) + (+s) * 1000);
}

/*
function ResolveSecondsAfterNow(s=0){return new Date((new Date).setMilliseconds(0)+(+s)*1000)}
*/

export const mkJsonifable = ((Base: any) => class extends Base {
    toJSON() {
        const json = super.toJSON?.(...arguments);
        if (json !== undefined) return json;
        return `${this}`;
    }
});

// assignProperties.ts
export function assignProperties(to: object, source: object, propertyNames: (string | symbol)[]): object {
    if (!isObject(to)) throw new TypeError('to isnt an object');
    for (let properryObj of propertyNames) {
        const property = EXMAScript.toPropertyKey(properryObj);
        Reflect.set(to, property, Reflect.get(source, property));
    }
    return to;
}

export function isObject(value: any): boolean {
    if (value === null) return false;
    return (typeof value === "object" || typeof value === "function");
}

export function sortArray<T>(array: T[], key: (element: T, index: number) => T, converter: (element: T, index: number) => T): T[] {
    return Array.from(array, converter ?? (m => m)).map(value => ({
        value, key: +Function.prototype.apply.call(key, value),
    })).sort((a, b) => a.key - b.key).map(({value}) => value);
}

export function getProperty(on: object, properties: (string | symbol)[]): unknown {
    const array = Array.from(properties, EXMAScript.toPropertyKey);
    if (!isObject(on)) throw new TypeError;
    let self = on;
    for (let property of array) {
        self = on;
        on = Reflect.get(on, property);
        if (on === null || on === undefined) {
            const element = {result: undefined, self};
            throw new CustomError(`couldnt read properties on (${on}) reading (${String(property)})`, element);
        }
    }
    const result = on;
    return {result, self};
}// the result is the property, the self is the (this) value.

export function allKeys(object: object): (string | symbol)[] {
    object = Object(object);
    const result = Reflect.ownKeys(object);
    while (object = Object.getPrototypeOf(object)) {
        result.push(...Reflect.ownKeys(object));
    }
    return [...(new Set(result))];
}

export function isSafeIntegerRange(n: bigint | number): boolean {
    n = -(-n) as bigint | number;
    if (typeof n === "bigint") {
        return n > Number.MIN_SAFE_INTEGER && n < Number.MAX_SAFE_INTEGER;
    } else return Number.isSafeInteger(n);
}

export function NumericAbs(n: bigint | number): bigint | number {
    n = -n as bigint | number;
    if (n < 0) return -n;
    return n;
}

export function getObjectType(o: any) {
    const s = Object.prototype.toString.call(o);
    return s.slice("[object ".length, -1);
}

export function countBooleansAndNullishItems(array: any[]): { true: number, false: number, nullish: number } {
    array = Array.from(array ?? [], b => (b === null || b === undefined) ? null : Boolean(b));
    const result = {true: 0, false: 0, nullish: 0};
    for (let e of array) {
        if (e === null) result.nullish += 1;
        else if (e) result.true += 1;
        else result.false += 1;
    }
    return result;
}

export function removeDuplications<T>(array: T[]): T[] {
    const dupe = Symbol("dupelication"), dupes = new Set;
    return Array.from(array, function (m) {
        if (dupes.has(m)) return dupe;
        dupes.add(m);
        return m;
    }).filter(m => m !== dupe) as T[];
}

export function startOfDay(date: Date | number | string): number {
    return (new Date(date ?? Date.now())).setHours(0, 0, 0, 0);
}

export function startOfDayUTC(date: Date | number | string): number {
    return (new Date(date ?? Date.now())).setUTCHours(0, 0, 0, 0);
}

export class CounterItems<T> {
    #items: Map<T, number> = new Map<T, number>;
    [Symbol.toStringTag] = 'CounterItems';

    add(object: T) {
        if (!this.#items.has(object)) {
            !this.#items.set(object, 0);
        }
        this.#items.set(object, this.#items.get(object)! + 1);
        return this;
    }

    set0(object: T) {
        if (!this.#items.has(object)) {
            !this.#items.set(object, 0);
        }
        return this;
    }

    get(object: T) {
        return Number(this.#items.get(object));
    }

    toJSON() {
        const obj: any = {__proto__: null};
        for (const [key, value] of this.#items) {
            if (typeof key === 'string') {
                obj[key] = value;
            }
        }
        return obj;
    }

    clear() {
        this.#items.clear();
        return this;
    }
}

export function printLn(varaibles: any) {
    const result = [];
    for (const [keuy, value] of Object.entries(varaibles)) {
        let variable = String(keuy) + '=';
        if (value === null) {
            result.push(`${variable}null`);
            continue;
        }
        switch (typeof value) {
            case "string":
            case "symbol":
                variable += JSON.stringify(String(value));
                break;
            case "number":
                variable += JSON.stringify(value);
                break;
            case "bigint":
                variable += String(value) + 'n';
                break;
            case "boolean":
                variable += JSON.stringify(value);
                break;
            case "undefined":
                variable += "undefined";
                break;
            case "object":
                variable += JSON.stringify(value);
                break;
            case "function":
                variable += JSON.stringify(String(value));
                break;
            default:
                throw new TypeError(`typeof value is not recognized (${typeof value})`);
        }
        result.push(variable);
    }
    return result.join('; ');
}

function sliceOut_String(string: string, start?: number, end?: number, strict: boolean = false) {
    Object.prototype.valueOf.call(string);
    string = `${string}`;
    const len = string.length;
    const intStart = EXMAScript.toIntegerOrInfinity(start);
    let from;
    if (strict) {
        from = intStart;
    } else {
        if (intStart === -Infinity) {
            from = 0;
        } else if (intStart < 0) {
            from = Math.max(len + intStart, 0);
        } else {
            from = Math.min(intStart, len);
        }
    }
    let intEnd;
    if (end === undefined) {
        intEnd = len;
    } else {
        intEnd = EXMAScript.toIntegerOrInfinity(end);
    }
    let to;
    if (strict) {
        to = intEnd;
    } else {
        if (intEnd === -Infinity) {
            to = 0;
        } else if (intEnd < 0) {
            to = Math.max(len + intEnd, 0);
        } else {
            to = Math.min(intEnd, len);
        }
    }
    if (from >= to) {
        if (strict) {
            throw new RangeError(`the normalized value of start (${from}) is greater than the normalized value of end (${to}) in sliceOut_String\'s strict mode`);
        } else {
            return "";
        }
    }
    if (strict) {
        if (from < 0) {
            throw new RangeError(`start is less than 0 in sliceOut_String\'s strict mode (got ${from})`);
        }
        if (to > len) {
            throw new RangeError(`end is greater than ${len} in sliceOut_String\'s strict mode (got ${to})`);
        }
    }
    return (string.slice(0, from) + string.slice(to));
}
