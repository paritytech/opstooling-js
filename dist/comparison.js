"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.doValuesContainSameData = exports.ld = void 0;
const deepdash_1 = __importDefault(require("deepdash"));
const lodash_1 = __importDefault(require("lodash"));
const normalization_1 = require("./normalization");
exports.ld = (0, deepdash_1.default)(lodash_1.default);
/*
  This function compares if two objects have the same values within them without
  considering the placement order of internal elements. e.g. for Arrays, [1,2]
  is not considered equal to [2,1] for isEqual and isDeepEqual because the
  elements' order is different.

  `null` and `undefined` entries are do not constitute a difference since
  entries with those values are considered to be "empty" and therefore not
  relevant for this comparison.

  See the tests in ./comparison.spec.ts for a better idea of how it works in
  practice.
*/
const doValuesContainSameData = (v1, v2) => {
    if (typeof v1 !== typeof v2) {
        return false;
    }
    /*
      Values are normalized in order to exclude "empty entries" (as explained in
      the documentation for this function) such as from both objects to be
      compared, otherwise such entries could get in the way of comparing the
      relevant data within each value
    */
    v1 = (0, normalization_1.normalizeValue)(v1);
    v2 = (0, normalization_1.normalizeValue)(v2);
    const comparedPaths = [];
    const isSomeKeyDifferent = (source, target) => {
        if (typeof source !== "object" || typeof target !== "object") {
            return source === target;
        }
        return exports.ld.someDeep(source, (sourceValue, _, __, ctx) => {
            const { path } = ctx;
            if (path === undefined) {
                return;
            }
            for (const prevPath of comparedPaths) {
                let matches = 0;
                for (let i = 0; i < prevPath.length; i++) {
                    if (prevPath[i] === path[i]) {
                        matches++;
                    }
                }
                if (matches === prevPath.length) {
                    return;
                }
            }
            const targetValue = exports.ld.get(target, path);
            if (typeof sourceValue !== "object" || typeof targetValue !== "object") {
                return sourceValue !== targetValue;
            }
            if (Array.isArray(sourceValue) || Array.isArray(targetValue)) {
                if (!Array.isArray(sourceValue) || !Array.isArray(targetValue)) {
                    return true;
                }
                for (const leftVal of sourceValue) {
                    if (targetValue.find((rightVal) => (0, exports.doValuesContainSameData)(leftVal, rightVal)) === undefined) {
                        return true;
                    }
                }
                comparedPaths.push(path);
            }
        }, { leavesOnly: false, pathFormat: "array", includeRoot: false });
    };
    return !isSomeKeyDifferent(v1, v2) && !isSomeKeyDifferent(v2, v1);
};
exports.doValuesContainSameData = doValuesContainSameData;
//# sourceMappingURL=comparison.js.map