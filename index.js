// antHelpers
/**
 * transform '\r\n' and '\r' to '\n'
 * @param string
 */
export function normalize_newlines(string) {
    return String(string).replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}
/**
 * adds 4 spaces to all '\n'
 * @param string
 */
export function indent_codeblock(string) {
    return '    ' + normalize_newlines(string).replace(/\n/g, '\n    ');
}
/**
 * Formats a string into a blockquote suitable for Markdown.
 * Each line of the string is prefixed with `> `, as per Markdown blockquote syntax.
 *
 * @param {string} string - The input string to format as a Markdown quote.
 * @returns {string} A string formatted as a Markdown blockquote.
 */
export function quoteMarkdown(string) {
    return '> ' + normalize_newlines(string).replace(/\n/g, '\n> ');
}
/**
 * Escapes special Markdown characters in a string to prevent formatting.
 * Characters escaped include: ~ ` > - \ [ ] ( ) # ^ & * _ ! <
 *
 * @param {string} string - The input string to escape for Markdown.
 * @reexport returns {string} The escaped string, safe for Markdown rendering.
 */
export function markdown_escape(string) {
    return normalize_newlines(string).replace(/[~`>\-\\\[\]()#^&*_!<]/g, '\\$&');
}
/**
 * encodes a json with an indent
 * @param jsonicItem the item you want to jsonify
 * @param indent a number corresponding to indent, use true for 2
 * @param replacer JSON.stringify's replacer
 */
export function jsonEncode(jsonicItem, indent = false, replacer) {
    if (indent === false)
        return JSON.stringify(jsonicItem, replacer);
    else
        return JSON.stringify(jsonicItem, replacer, indent === true ? 2 : +indent);
}
/**
 * like jsonEncode but also adds 4 spaces to it
 * @param jsonicItem the json item to convert
 * @param indent a number corresponding to indent, use true for 2
 * @param replacer JSON.stringify's replacer
 */
export function jsonEncodeIndent(jsonicItem, indent = true, replacer) {
    return indent_codeblock(jsonEncode(jsonicItem, indent, replacer));
}
// CustomError
export class CustomError extends Error {
    detail;
    constructor(message, detail) {
        super(message);
        this.detail = detail;
        this.name = new.target?.name ?? 'CustomError';
    }
    get [Symbol.toStringTag]() {
        return this.name;
    }
    static [Symbol.toStringTag] = "CustomError";
}
export const EXMAScript = Object.freeze({
    __proto__: {
        [Symbol.toStringTag]: 'EXMAScriptInternals',
    }, toIntegerOrInfinity(n) {
        n = +n;
        if (Object.is(n, NaN) || n === 0) {
            return 0;
        }
        else
            return Math.trunc(n);
    }, OrdinaryToPrimitive(mixed, hint = "number") {
        if (!["string", "number"].includes(hint))
            throw new TypeError('incorrect hint');
        if (!isObject(mixed))
            return mixed;
        const methodNames = hint === "string" ? ["toString", "valueOf"] : ["valueOf", "toString"];
        for (let methodName of methodNames) {
            if (methodName in mixed) {
                if (typeof mixed[methodName] === "function") {
                    const primitive = mixed[methodName]();
                    if (!isObject(primitive))
                        return primitive;
                }
            }
        }
        throw new TypeError('could not convert to Primitive');
    }, toPrimitive(value, hint) {
        if (!["string", "number", "default"].includes(hint))
            throw new TypeError('incorrect hint');
        let primitive;
        if (value === null)
            return "null";
        if (typeof value === "object" || typeof value === "function") {
            if (Symbol.toPrimitive in value && typeof value[Symbol.toPrimitive] === "function") {
                primitive = value[Symbol.toPrimitive](hint);
                if (isObject(primitive))
                    throw new TypeError('could not convert to primitive');
            }
            else {
                primitive = EXMAScript.OrdinaryToPrimitive(value, "string");
            }
        }
        else
            primitive = value;
        return primitive;
    }, toPropertyKey(value) {
        const primitive = EXMAScript.toPrimitive(value, "string");
        if (typeof primitive === "symbol")
            return primitive;
        return String(primitive);
    }, toNumeric(value) {
        // Handle object conversion
        value = EXMAScript.toPrimitive(value, "number");
        if (typeof value === 'bigint')
            return value;
        else
            return +value;
    }, isNaN(nan) {
        return isNaN(nan);
    }, webBuiltins: Object.freeze({
        [Symbol.toStringTag]: 'WebInternals',
        TokenList: class TokenList {
            #tokens;
            constructor(array) {
                this.#tokens = new Set(Array.from(array, s => `${s}`));
            }
            [Symbol.toStringTag] = 'TokenList';
            toString() {
                return Array.prototype.join.call(Array.from(this.#tokens.keys()), ' ');
            }
            add(...tokens) {
                Array.from(tokens).forEach(s => this.#tokens.add(this._validateToken(s)));
            }
            contains(token) {
                return this.#tokens.has(token);
            }
            remove(...tokens) {
                Array.from(tokens).forEach(s => this.#tokens.delete(this._validateToken(s)));
            }
            toggle(token, force = undefined) {
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
            _validateToken(token) {
                token = `${token}`;
                if (token === '') {
                    throw new EXMAScript.webBuiltins.SyntaxError('token is empty');
                }
                else if (/\s+/.test(token)) {
                    throw new EXMAScript.webBuiltins.InvalidCharacterError('token is contains whitespace');
                }
                return token;
            }
            replace(oldToken, newToken) {
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
            constructor(m) {
                super(m, '"SyntaxError" DOMException');
            }
        },
        InvalidCharacterError: class extends CustomError {
            constructor(m) {
                super(m, '"InvalidCharacterError" DOMException');
            }
        },
    }),
});
export function ResolveSecondsAfterNow(s = 0) {
    return new Date((new Date).setMilliseconds(0) + (+s) * 1000);
}
export function ResolveSecondsAfter(s = 0, now) {
    return new Date((new Date(now ?? Date.now())).setMilliseconds(0) + (+s) * 1000);
}
/*
function ResolveSecondsAfterNow(s=0){return new Date((new Date).setMilliseconds(0)+(+s)*1000)}
*/
export const mkJsonifable = ((Base) => class extends Base {
    toJSON() {
        const json = super.toJSON?.(...arguments);
        if (json !== undefined)
            return json;
        return `${this}`;
    }
});
// assignProperties.ts
export function assignProperties(to, source, propertyNames) {
    if (!isObject(to))
        throw new TypeError('to isnt an object');
    for (let properryObj of propertyNames) {
        const property = EXMAScript.toPropertyKey(properryObj);
        Reflect.set(to, property, Reflect.get(source, property));
    }
    return to;
}
export function isObject(value) {
    if (value === null)
        return false;
    return (typeof value === "object" || typeof value === "function");
}
export function sortArray(array, key, converter) {
    return Array.from(array, converter ?? (m => m)).map(value => ({
        value, key: +Function.prototype.apply.call(key, value),
    })).sort((a, b) => a.key - b.key).map(({ value }) => value);
}
export function getProperty(on, properties) {
    const array = Array.from(properties, EXMAScript.toPropertyKey);
    if (!isObject(on))
        throw new TypeError;
    let self = on;
    for (let property of array) {
        self = on;
        on = Reflect.get(on, property);
        if (on === null || on === undefined) {
            const element = { result: undefined, self };
            throw new CustomError(`couldnt read properties on (${on}) reading (${String(property)})`, element);
        }
    }
    const result = on;
    return { result, self };
} // the result is the property, the self is the (this) value.
export function allKeys(object) {
    object = Object(object);
    const result = Reflect.ownKeys(object);
    while (object = Object.getPrototypeOf(object)) {
        result.push(...Reflect.ownKeys(object));
    }
    return [...(new Set(result))];
}
export function isSafeIntegerRange(n) {
    n = -(-n);
    if (typeof n === "bigint") {
        return n > Number.MIN_SAFE_INTEGER && n < Number.MAX_SAFE_INTEGER;
    }
    else
        return Number.isSafeInteger(n);
}
export function NumericAbs(n) {
    n = -n;
    if (n < 0)
        return -n;
    return n;
}
export function getObjectType(o) {
    const s = Object.prototype.toString.call(o);
    return s.slice("[object ".length, -1);
}
export function countBooleansAndNullishItems(array) {
    array = Array.from(array ?? [], b => (b === null || b === undefined) ? null : Boolean(b));
    const result = { true: 0, false: 0, nullish: 0 };
    for (let e of array) {
        if (e === null)
            result.nullish += 1;
        else if (e)
            result.true += 1;
        else
            result.false += 1;
    }
    return result;
}
export function removeDuplications(array) {
    const dupe = Symbol("dupelication"), dupes = new Set;
    return Array.from(array, function (m) {
        if (dupes.has(m))
            return dupe;
        dupes.add(m);
        return m;
    }).filter(m => m !== dupe);
}
export function startOfDay(date) {
    return (new Date(date ?? Date.now())).setHours(0, 0, 0, 0);
}
export function startOfDayUTC(date) {
    return (new Date(date ?? Date.now())).setUTCHours(0, 0, 0, 0);
}
export class CounterItems {
    #items = new Map;
    [Symbol.toStringTag] = 'CounterItems';
    add(object) {
        if (!this.#items.has(object)) {
            !this.#items.set(object, 0);
        }
        this.#items.set(object, this.#items.get(object) + 1);
        return this;
    }
    set0(object) {
        if (!this.#items.has(object)) {
            !this.#items.set(object, 0);
        }
        return this;
    }
    get(object) {
        return Number(this.#items.get(object));
    }
    toJSON() {
        const obj = { __proto__: null };
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
export function printLn(varaibles) {
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
function sliceOut_String(string, start, end, strict = false) {
    Object.prototype.valueOf.call(string);
    string = `${string}`;
    const len = string.length;
    const intStart = EXMAScript.toIntegerOrInfinity(start);
    let from;
    if (strict) {
        from = intStart;
    }
    else {
        if (intStart === -Infinity) {
            from = 0;
        }
        else if (intStart < 0) {
            from = Math.max(len + intStart, 0);
        }
        else {
            from = Math.min(intStart, len);
        }
    }
    let intEnd;
    if (end === undefined) {
        intEnd = len;
    }
    else {
        intEnd = EXMAScript.toIntegerOrInfinity(end);
    }
    let to;
    if (strict) {
        to = intEnd;
    }
    else {
        if (intEnd === -Infinity) {
            to = 0;
        }
        else if (intEnd < 0) {
            to = Math.max(len + intEnd, 0);
        }
        else {
            to = Math.min(intEnd, len);
        }
    }
    if (from >= to) {
        if (strict) {
            throw new RangeError(`the normalized value of start (${from}) is greater than the normalized value of end (${to}) in sliceOut_String\'s strict mode`);
        }
        else {
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
