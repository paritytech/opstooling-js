import { randomUUID } from "crypto"

const usedIds = new Set<string>()

export type FreeId = {
  id: string
  release: () => void
}
export const getFreeId = (): FreeId => {
  const freeId = (() => {
    while (true) {
      const id = randomUUID().replace(/\W/g, "")
      if (!usedIds.has(id)) {
        usedIds.add(id)
        return id
      }
    }
  })()
  return {
    id: freeId,
    release: () => {
      usedIds.delete(freeId)
    },
  }
}

export function ensureDefined<T>(input: T | undefined | null, message?: string): NonNullable<T> {
  if (input === undefined || input === null) {
    throw new Error(message ?? `Expected input to be defined, got ${String(input)}`)
  }
  return input as NonNullable<T>
}
