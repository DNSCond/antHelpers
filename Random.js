// javascript.js
import { EXMAScript } from "./index.js";
export class Random {
    #seed;
    constructor(seed = 0n) {
        this.#seed = BigInt(seed);
    }
    next(min = 0n, max = 1000n) {
        // Linear congruential generator
        this.#seed = (this.#seed * 6364136223846793005n + 1n) & ((1n << 64n) - 1n);
        min = BigInt(min);
        max = BigInt(max);
        return min + (this.#seed % (max - min));
    }
    [Symbol.toStringTag] = "PRandom";
    static [Symbol.toStringTag] = "PRandom constructor";
    fillArray(array, min = 0n, max = 100000n) {
        const length = EXMAScript.toIntegerOrInfinity(array?.length);
        if (length === 0)
            return array;
        for (let i = 0; i < length; i++) {
            const skip = (array[i] = this.next(min, max)) % 17n;
            for (let ii = 0; ii < skip; ii++)
                this.next(min, max);
        }
        return array;
    }
}
export class WeightedRandomRarity extends Random {
    #rarities;
    constructor(rarities, seed = undefined) {
        super(BigInt(seed ?? Date.now()));
        const entries = Object.entries(Object.assign({}, rarities));
        (this.#rarities = entries.map(([key, value]) => [key,
            Math.trunc(value)])).forEach(([key, value]) => {
            if (value < 0)
                throw new RangeError(`${key}: is negative`);
        });
    }
    // @ts-expect-error
    next() {
        const entries = this.#rarities;
        const total = this.cumulative();
        const rand = super.next(0n, BigInt(total));
        let cumulative = 0;
        for (const [key, w] of entries) {
            cumulative += w;
            if (rand < cumulative)
                return key;
        }
        return entries[0][0];
    }
    cumulative() {
        const entries = this.#rarities;
        return entries.reduce((sum, [, value]) => sum + value, 0);
    }
    getOdds() {
        const total = this.cumulative();
        const entries = this.#rarities, result = {
            [Symbol.toStringTag]: "Rarities", total,
            asPercents: { [Symbol.toStringTag]: "Rarities asPercents" },
            asFloats: { [Symbol.toStringTag]: "Rarities asFloats" },
            internal: { [Symbol.toStringTag]: "Rarities asFloats" },
        };
        for (const entry of entries) {
            result.internal[entry[0]] = entry[1];
            result.asFloats[entry[0]] = entry[1] / total;
            const asPercent = ((entry[1] / total) * 100).toFixed(2) + '%';
            result.asPercents[entry[0]] = asPercent.replace(/\.00%$/, '%');
        }
        Object.freeze(result.internal);
        Object.freeze(result.asFloats);
        Object.freeze(result.asPercents);
        return Object.freeze(result);
    }
}
