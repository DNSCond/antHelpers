// parseBigInt.ts
export function parseBigInt(string, base = 10) {
    if (!Number.isSafeInteger(base) || base < 2 || base > 36)
        throw new RangeError("base must be an integer between 2 and 36");
    const strx = '0123456789abcdefghijklmnopqrstuvwxyz', baseBigInt = BigInt(base), baseNumber = Number(base), sliced = strx.slice(0, baseNumber), allowedCharacters = RegExp(`^[\\-+]?[${sliced}]+`, 'i');
    const trimmed = `${string}`.trim(), regexpMatchArray = trimmed.match(allowedCharacters);
    if (base === 10) {
        const regexpMatchArray = trimmed.match(/^([\-+]?)(\d+)[Ee]([\-+]?)(\d+)/);
        if (regexpMatchArray) {
            const [, sign, int, expSign, exp] = regexpMatchArray;
            let bigInt = BigInt(`${sign}${int}`);
            if (expSign === '-') {
                bigInt = bigInt / (10n ** BigInt(exp));
            }
            else {
                bigInt = bigInt * (10n ** BigInt(exp));
            }
            return bigInt;
        }
    }
    if (trimmed === '')
        return null;
    if (regexpMatchArray === null)
        return null;
    const matchArray = regexpMatchArray[0].replace(/^[\-+]?/, ''), replaced = baseBigInt === 10n ? matchArray.replace(/n$/, '') : matchArray;
    let result = 0n, negative = false;
    if (regexpMatchArray[0].startsWith('-'))
        negative = true;
    for (const character of replaced.toLowerCase()) {
        const index = strx.indexOf(character);
        if (index < 0)
            break;
        result = result * baseBigInt + BigInt(index);
    }
    return negative ? -result : result;
}
export function fuzzyNumber(value) {
    let bigint;
    value = -(-value);
    if (typeof value === "number") {
        bigint = BigInt(Math.trunc(value));
    }
    else
        bigint = value;
    if (bigint < 0)
        return `-${fuzzyNumber(-bigint)}`;
    if (bigint < 1000n)
        return bigint.toString();
    const units = [
        { suffix: "Qi", value: 1000000000000000000n },
        { suffix: "Q", value: 1000000000000000n },
        { suffix: "T", value: 1000000000000n },
        { suffix: "B", value: 1000000000n },
        { suffix: "M", value: 1000000n },
        { suffix: "K", value: 1000n },
    ];
    for (const unit of units) {
        if (bigint >= unit.value) {
            let result = 0;
            if (bigint > Number.MAX_SAFE_INTEGER) {
                result = Number(bigint / (unit.value / 1000n)) / 1000;
            }
            else
                result = Number(bigint) / Number(unit.value);
            return result.toFixed(1).replace(/\.0+$/, '') + unit.suffix;
        }
    }
    return '[Error: Unreachable code: all cases should be handled]';
}
