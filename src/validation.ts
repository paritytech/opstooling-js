import Joi from "joi";

type Options = {
  /** Custom error message, will be followed by validation errors from Joi */
  message?: string;
};

export function validate<T>(item: unknown, schema: Joi.Schema, options: Options = {}): T {
  const joiOpts = { allowUnknown: true, abortEarly: false, convert: true };

  if (options.message) {
    return Joi.attempt(item, schema, `${options.message}:`, joiOpts) as T;
  }
  return Joi.attempt(item, schema, joiOpts) as T;
}
