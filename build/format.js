"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redact = void 0;
const redact = (str, items, replacement) => {
    for (const item of items) {
        str = str.replaceAll(item, replacement);
    }
    return str;
};
exports.redact = redact;
