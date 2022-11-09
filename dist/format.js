"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redact = void 0;
const redact = (str, items) => {
    for (const item of items) {
        str = str.replaceAll(item, "{REDACTED}");
    }
    return str;
};
exports.redact = redact;
//# sourceMappingURL=format.js.map