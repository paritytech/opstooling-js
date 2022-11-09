"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetch = exports.validatedFetch = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
exports.fetch = node_fetch_1.default;
const validation_1 = require("./validation");
const validatedFetch = async (response, schema, { decoding } = { decoding: "json" }) => {
    const body = await (async () => {
        const result = await response;
        if (result.status >= 400) {
            throw new Error(`Unexpected code: ${result.status}. Url: ${result.url}. Body: ${await result.text()}`);
        }
        switch (decoding) {
            case "json": {
                return await result.json();
            }
            default: {
                const exhaustivenessCheck = decoding;
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                throw new Error(`Not exhaustive: ${exhaustivenessCheck}`);
            }
        }
    })();
    return (0, validation_1.validate)(body, schema);
};
exports.validatedFetch = validatedFetch;
//# sourceMappingURL=http.js.map