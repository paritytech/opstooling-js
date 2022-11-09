import Joi from "joi";
import fetch from "node-fetch";
export declare const validatedFetch: <T>(response: ReturnType<typeof fetch>, schema: Joi.Schema<T>, { decoding }?: {
    decoding: "json";
}) => Promise<T>;
export { fetch };
