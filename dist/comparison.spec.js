"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const assert_1 = require("assert");
const comparison_1 = require("./comparison");
(0, globals_1.describe)("doValuesContainSameData", () => {
    (0, globals_1.it)("Values contain same data even if in different orders", () => {
        (0, assert_1.equal)((0, comparison_1.doValuesContainSameData)({ a: [1, 2] }, { a: [2, 1] }), true);
    });
    (0, globals_1.it)("Values are different due to different keys", () => {
        (0, assert_1.equal)((0, comparison_1.doValuesContainSameData)({ a: [] }, { b: [] }), false);
    });
    (0, globals_1.it)("Values are different due to missing keys", () => {
        (0, assert_1.equal)((0, comparison_1.doValuesContainSameData)({ a: [] }, {}), false);
    });
    (0, globals_1.it)("Values contain same data for nested objects inside arrays", () => {
        (0, assert_1.equal)((0, comparison_1.doValuesContainSameData)({ a: [{ b: 1 }, { a: 2 }] }, { a: [{ a: 2 }, { b: 1 }] }), true);
    });
    (0, globals_1.it)("Values contain same data for nested objects", () => {
        (0, assert_1.equal)((0, comparison_1.doValuesContainSameData)({ a: { b: 1 }, c: { d: 1 } }, { c: { d: 1 }, a: { b: 1 } }), true);
    });
});
//# sourceMappingURL=comparison.spec.js.map