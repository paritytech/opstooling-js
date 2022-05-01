"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.displayError = exports.intoError = void 0;
const intoError = (value) => {
    if (value instanceof Error) {
        return value;
    }
    return new Error(String(value));
};
exports.intoError = intoError;
const displayError = (value) => {
    const error = (0, exports.intoError)(value);
    return `${error.toString()}${error.stack ? `\n${error.stack}` : ""}`;
};
exports.displayError = displayError;
