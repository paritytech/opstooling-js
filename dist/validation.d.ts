import Joi from "joi";
declare type Options = {
    /** Custom error message, will be followed by validation errors from Joi */
    message?: string;
};
export declare function validate<T>(item: unknown, schema: Joi.Schema, options?: Options): T;
export {};
