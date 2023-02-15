"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envNumberVar = exports.envVar = void 0;
const assert_1 = __importDefault(require("assert"));
const envVar = (name) => {
    const val = process.env[name];
    if (typeof val !== "string") {
        throw new Error(`${name} was not found in the environment variables`);
    }
    return val;
};
exports.envVar = envVar;
const envNumberVar = (name) => {
    const val = process.env[name];
    (0, assert_1.default)(val, `${name} was not found in the environment variables`);
    const valNumber = parseInt(val);
    (0, assert_1.default)(valNumber, `${name} is not a number`);
    return valNumber;
};
exports.envNumberVar = envNumberVar;
//# sourceMappingURL=env.js.map