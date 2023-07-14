import Joi from "joi";

type Options = {
  /** Custom error message, will be followed by validation errors from Joi */
  message?: string;
};

/**
 * Validates an object against to a JOI schema
 *
 * @example
 * import { validate } from "@eng-automation/js";
 * import { configSchema } from "./utils";
 *
 * const myConfig: unknown = JSON.parse(jsonString);
 * const config: ConfigurationFile validate<ConfigurationFile>(config, configSchema, { message: "Configuration file is invalid" });
 *
 * @param item the javascript object to be parsed.
 * @param schema the [JOI.schema object]({@link https://joi.dev/api/})
 * @param options an object with a message value. See example.
 * @returns the objected converted to the given type
 */
export function validate<T>(item: unknown, schema: Joi.Schema, options: Options = {}): T {
  const joiOpts = { allowUnknown: true, abortEarly: false, convert: true };

  if (options.message) {
    return Joi.attempt(item, schema, `${options.message}:`, joiOpts) as T;
  }
  return Joi.attempt(item, schema, joiOpts) as T;
}
