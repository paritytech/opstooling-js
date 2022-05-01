"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeValue = void 0;
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call */
const normalizers = {
    symbol: (value) => {
        return value.toString();
    },
    bigint: (value) => {
        return value.toString();
    },
    undefined: () => {
        return undefined;
    },
    function: () => {
        return undefined;
    },
    boolean: (value) => {
        return value;
    },
    number: (value) => {
        return value;
    },
    string: (value) => {
        return value;
    },
    object: (value, previousObjects = []) => {
        if (value === null) {
            return;
        }
        previousObjects = previousObjects.concat([value]);
        const isArray = Array.isArray(value);
        const isIterable = !isArray && Symbol.iterator in value;
        const objAsArray = isArray
            ? value
            : isIterable
                ? Array.from(value)
                : undefined;
        if (objAsArray === undefined && !(value instanceof Error)) {
            const asString = typeof value.toString === "function" && value.toString.length === 0
                ? value.toString()
                : undefined;
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
const normalizeValue = (value, previousObjects = []) => {
    return normalizers[typeof value](value, previousObjects);
};
exports.normalizeValue = normalizeValue;
