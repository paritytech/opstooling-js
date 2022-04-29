export const redact = (str: string, items: string[], replacement: string) => {
  for (const item of items) {
    str = str.replaceAll(item, replacement)
  }
  return str
}
