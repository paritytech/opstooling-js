export const redact = (str: string, items: string[]) => {
  for (const item of items) {
    str = str.replaceAll(item, "{REDACTED}")
  }
  return str
}
