import { randomUUID } from "crypto"

const usedIds = new Set<string>()
export const getFreeId = () => {
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
