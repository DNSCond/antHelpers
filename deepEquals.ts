// deeplyEquals
export function deeplyEquals(le: any, ri: any, checkProto: boolean = false): boolean {
    if (le === ri) return true;
    if (le === null || ri === null) return false;
    if (typeof le !== typeof ri) return false;
    if (typeof le == "object" && typeof ri == "object") {
        const leProps = sortAsStrings(Reflect.ownKeys(le));
        const riProps = sortAsStrings(Reflect.ownKeys(ri));
        if (leProps.length !== riProps.length) return false;
        for (let i = 0; i < leProps.length; i++) {
            const key = leProps[i];
            if (key !== riProps[i]) return false; // ensure same key names
            if (!deeplyEquals(le[key], ri[key], checkProto)) return false;
        }
        if (checkProto) return deeplyEquals(Object.getPrototypeOf(le), Object.getPrototypeOf(ri));
        return true;
    } else return false;
}

export function sortAsStrings<T>(array: T[]): T[] {
    return Array.from(array, value => ({
        value, toString() {
            return String(this.value)
        }
    })).sort().map(({value}) => value);
}
