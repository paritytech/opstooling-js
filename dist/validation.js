"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const joi_1 = __importDefault(require("joi"));
function validate(item, schema, options = {}) {
    const joiOpts = { allowUnknown: true, abortEarly: false, convert: true };
    if (options.message) {
        return joi_1.default.attempt(item, schema, `${options.message}:`, joiOpts);
    }
    return joi_1.default.attempt(item, schema, joiOpts);
}
exports.validate = validate;
//# sourceMappingURL=validation.js.map