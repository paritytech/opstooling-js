"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeValue = void 0;
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any */
const normalizers = {
    symbol: (value) => value.toString(),
    bigint: (value) => value.toString(),
    undefined: () => undefined,
    function: () => undefined,
    boolean: (value) => value,
    number: (value) => value,
    string: (value) => value,
    object: (value, previousObjects = [], showTopLevel = false) => {
        if (value === null) {
            return;
        }
        previousObjects = previousObjects.concat([value]);
        const isArray = Array.isArray(value);
        const isIterable = !isArray && Symbol.iterator in value;
        const objAsArray = isArray ? value : isIterable ? Array.from(value) : undefined;
        if (objAsArray === undefined && !(value instanceof Error)) {
            const asString = typeof value.toString === "function" && value.toString.length === 0 ? value.toString() : undefined;
            if (typeof asString === "string" && asString !== "[object Object]") {
                return asString;
            }
        }
        const { container, output } = (() => {
            if (isIterable) {
                const iteratorContainer = { type: value.constructor.name, items: [] };
                return { container: iteratorContainer, output: iteratorContainer.items };
            }
            const outputObj = objAsArray === undefined ? {} : [];
            return { container: outputObj, output: outputObj };
        })();
        const sourceObj = objAsArray ?? value;
        for (const key of Object.getOwnPropertyNames(sourceObj)) {
            setNormalizedKeyValue(sourceObj, output, key, previousObjects);
        }
        if (Object.keys(output).length > 0) {
            return container;
        }
        else if (showTopLevel) {
            return objAsArray ? [] : {};
        }
    },
};
const setNormalizedKeyValue = (source, output, key, previousObjects) => {
    if (previousObjects.indexOf(source[key]) !== -1) {
        return "[Circular]";
    }
    const value = (0, exports.normalizeValue)(source[key], previousObjects);
    if (value === undefined) {
        return;
    }
    output[key] = value;
};
const normalizeValue = (value, previousObjects = [], showTopLevel = false) => normalizers[typeof value](value, previousObjects, showTopLevel);
exports.normalizeValue = normalizeValue;
/* eslint-enable */
//# sourceMappingURL=normalization.js.map