import type { AnySchema } from "joi"
import fetch from "node-fetch"

import { validate } from "./validation"

export const validatedFetch = async <T>(
  response: ReturnType<typeof fetch>,
  schema: AnySchema,
  { decoding }: { decoding: "json" } = { decoding: "json" },
): Promise<T> => {
  const body = await (async () => {
    const result = await response

    if (result.status >= 400) {
      throw new Error(`Unexpected code: ${result.status}. Url: ${result.url}. Body: ${await result.text()}`)
    }

    switch (decoding) {
      case "json": {
        return await result.json()
      }
      default: {
        const exhaustivenessCheck: never = decoding
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        throw new Error(`Not exhaustive: ${exhaustivenessCheck}`)
      }
    }
  })()

  return validate<T>(body, schema)
}

export { fetch }
