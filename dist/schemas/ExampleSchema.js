"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExampleSchema = void 0;
const joi_1 = __importDefault(require("joi"));
// TODO: remove ExampleSchema after we have actual schemas here
exports.ExampleSchema = joi_1.default.object({
    foo: joi_1.default.string().allow("foo", "bar", "baz"),
    flags: joi_1.default.object({ required: joi_1.default.boolean().required(), optional: joi_1.default.boolean().allow(null) }).required(),
}).meta({ className: "Example" });
//# sourceMappingURL=ExampleSchema.js.map