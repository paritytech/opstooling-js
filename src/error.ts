export const intoError = (value: unknown): Error => {
  if (value instanceof Error) {
    return value;
  }
  return new Error(String(value));
};

export const displayError = (value: unknown): string => {
  const error = intoError(value);
  return `${error.toString()}${error.stack ? `\n${error.stack}` : ""}`;
};
