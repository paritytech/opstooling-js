"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureDefined = exports.getFreeId = void 0;
const crypto_1 = require("crypto");
const usedIds = new Set();
const getFreeId = () => {
    const freeId = (() => {
        while (true) {
            const id = (0, crypto_1.randomUUID)().replace(/\W/g, "");
            if (!usedIds.has(id)) {
                usedIds.add(id);
                return id;
            }
        }
    })();
    return {
        id: freeId,
        release: () => {
            usedIds.delete(freeId);
        },
    };
};
exports.getFreeId = getFreeId;
function ensureDefined(input, message) {
    if (input === undefined || input === null) {
        throw new Error(message ?? `Expected input to be defined, got ${String(input)}`);
    }
    return input;
}
exports.ensureDefined = ensureDefined;
//# sourceMappingURL=utils.js.map