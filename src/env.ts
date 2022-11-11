import assert from "assert";

export const envVar = (name: string): string => {
  const val = process.env[name];
  if (typeof val !== "string") {
    throw new Error(`${name} was not found in the environment variables`);
  }
  return val;
};

export const envNumberVar = (name: string): number => {
  const val = process.env[name];
  assert(val, `${name} was not found in the environment variables`);
  const valNumber = parseInt(val);
  assert(valNumber, `${name} is not a number`);
  return valNumber;
};
