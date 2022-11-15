import Joi from "joi";

// TODO: remove ExampleSchema after we have actual schemas here

export const ExampleSchema = Joi.object({
  foo: Joi.string().allow("foo", "bar", "baz"),
  flags: Joi.object({ required: Joi.boolean().required(), optional: Joi.boolean().allow(null) }).required(),
}).meta({ className: "Example" });
