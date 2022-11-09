import Joi from "joi";
import { RequestInfo, RequestInit } from "node-fetch";
export declare type ValidatedFetchParams = {
    decoding: "json";
    init?: RequestInit;
};
export declare const validatedFetch: <T>(url: RequestInfo, schema: Joi.Schema<T>, { decoding, init }?: ValidatedFetchParams) => Promise<T>;
