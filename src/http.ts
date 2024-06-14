import Joi from "joi";

import { validate } from "./validation";

export type ValidatedFetchParams = {
  decoding?: "json";
  init?: RequestInit;
};

export const validatedFetch = async <T>(
  url: string | URL | Request,
  schema: Joi.Schema<T>,
  { decoding, init }: ValidatedFetchParams = {},
): Promise<T> => {
  const result = await fetch(url, init);

  const body: unknown = await (async () => {
    if (result.status >= 400) {
      throw new Error(`Unexpected code: ${result.status}. Url: ${result.url}. Body: ${await result.text()}`);
    }

    const actualDecoding = decoding ?? "json";

    switch (actualDecoding) {
      case "json": {
        return await result.json();
      }
      default: {
        const exhaustivenessCheck: never = actualDecoding;
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        throw new Error(`Not exhaustive: ${exhaustivenessCheck}`);
      }
    }
  })();

  return validate<T>(body, schema);
};
