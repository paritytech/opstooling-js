import deepdash from "deepdash"
import lodash from "lodash"

import { normalizeValue } from "./normalization"

export const ld = deepdash(lodash)

export const doValuesContainSameData = (v1: unknown, v2: unknown) => {
  if (typeof v1 !== typeof v2) {
    return false
  }

  v1 = normalizeValue(v1)
  v2 = normalizeValue(v2)

  type ArrayPath = (string | number)[]
  const comparedPaths: ArrayPath[] = []

  const isSomeKeyDifferent = (source: unknown, target: unknown) => {
    if (typeof source !== "object" || typeof target !== "object") {
      return source === target
    }

    return ld.someDeep(
      source,
      (sourceValue, _, __, ctx) => {
        const { path } = ctx as { path: ArrayPath | undefined }
        if (path === undefined) {
          return
        }

        for (const prevPath of comparedPaths) {
          let matches = 0
          for (let i = 0; i < prevPath.length; i++) {
            if (prevPath[i] === path[i]) {
              matches++
            }
          }
          if (matches === prevPath.length) {
            return
          }
        }

        const targetValue = ld.get(target, path) as unknown

        if (
          typeof sourceValue !== "object" ||
          typeof targetValue !== "object"
        ) {
          return sourceValue !== targetValue
        }

        if (Array.isArray(sourceValue) || Array.isArray(targetValue)) {
          if (!Array.isArray(sourceValue) || !Array.isArray(targetValue)) {
            return true
          }
          for (const leftVal of sourceValue) {
            if (
              targetValue.find((rightVal) => {
                return doValuesContainSameData(leftVal, rightVal)
              }) === undefined
            ) {
              return true
            }
          }
          comparedPaths.push(path)
        }
      },
      { leavesOnly: false, pathFormat: "array", includeRoot: false },
    )
  }

  return !isSomeKeyDifferent(v1, v2) && !isSomeKeyDifferent(v2, v1)
}
