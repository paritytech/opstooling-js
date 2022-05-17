import type { AnySchema } from "joi"
import fetch from "node-fetch"

export const validatedFetch = async <T>(
  response: ReturnType<typeof fetch>,
  schema: AnySchema,
  { decoding }: { decoding: "json" } = { decoding: "json" },
) => {
  const body = await (async () => {
    switch (decoding) {
      case "json": {
        return (await response).json()
      }
      default: {
        const exhaustivenessCheck: never = decoding
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        throw new Error(`Not exhaustive: ${exhaustivenessCheck}`)
      }
    }
  })()
  const validation = schema.validate(body)
  if (validation.error) {
    throw validation.error
  }
  return validation.value as T
}

export { fetch }
