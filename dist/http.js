"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatedFetch = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const validation_1 = require("./validation");
const validatedFetch = async (url, schema, { decoding, init } = {}) => {
    const result = await (0, node_fetch_1.default)(url, init);
    const body = await (async () => {
        if (result.status >= 400) {
            throw new Error(`Unexpected code: ${result.status}. Url: ${result.url}. Body: ${await result.text()}`);
        }
        const actualDecoding = decoding ?? "json";
        switch (actualDecoding) {
            case "json": {
                return await result.json();
            }
            default: {
                const exhaustivenessCheck = actualDecoding;
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                throw new Error(`Not exhaustive: ${exhaustivenessCheck}`);
            }
        }
    })();
    return (0, validation_1.validate)(body, schema);
};
exports.validatedFetch = validatedFetch;
//# sourceMappingURL=http.js.map