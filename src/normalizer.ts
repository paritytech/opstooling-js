/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call */
const normalizers = {
  symbol: (value: any) => {
    return value.toString()
  },
  bigint: (value: any) => {
    return value.toString()
  },
  undefined: () => {
    return undefined
  },
  function: () => {
    return undefined
  },
  boolean: (value: any) => {
    return value
  },
  number: (value: any) => {
    return value
  },
  string: (value: any) => {
    return value
  },
  object: (
    value: any,
    previousObjects: unknown[] = [],
    showTopLevel = false,
  ) => {
    if (value === null) {
      return
    }

    previousObjects = previousObjects.concat([value])

    const isArray = Array.isArray(value)
    const isIterable = !isArray && Symbol.iterator in value
    const objAsArray = isArray
      ? value
      : isIterable
      ? Array.from(value as Iterable<unknown>)
      : undefined

    if (objAsArray === undefined && !(value instanceof Error)) {
      const asString =
        typeof value.toString === "function" && value.toString.length === 0
          ? value.toString()
          : undefined
      if (typeof asString === "string" && asString !== "[object Object]") {
        return asString
      }
    }

    const { container, output } = (() => {
      if (isIterable) {
        const iteratorContainer = { type: value.constructor.name, items: [] }
        return { container: iteratorContainer, output: iteratorContainer.items }
      }
      const outputObj = objAsArray === undefined ? {} : []
      return { container: outputObj, output: outputObj }
    })()

    const sourceObj = objAsArray ?? value
    for (const key of Object.getOwnPropertyNames(sourceObj)) {
      setNormalizedKeyValue(sourceObj, output, key, previousObjects)
    }

    if (Object.keys(output).length > 0) {
      return container
    } else if (showTopLevel) {
      return objAsArray ? [] : {}
    }
  },
}

const setNormalizedKeyValue = (
  source: any,
  output: any,
  key: any,
  previousObjects: unknown[],
) => {
  if (previousObjects.indexOf(source[key]) !== -1) {
    return "[Circular]"
  }

  const value = normalizeValue(source[key], previousObjects)
  if (value === undefined) {
    return
  }

  output[key] = value
}

export const normalizeValue = (
  value: unknown,
  previousObjects: unknown[] = [],
  showTopLevel = false,
): unknown => {
  return normalizers[typeof value](value, previousObjects, showTopLevel)
}
/* eslint-enable */
