const deprecateOkErr = () =>
  console.warn(
    "The usage of the Ok/Err pattern is deprecated because of the danger of mismatched 'instanceof' types in node_modules. " +
      "Please use the regular try-catch pattern.",
  );

/**
 * @deprecated
 * The usage of the Ok/Err pattern is deprecated because of the danger of mismatched 'instanceof' types in node_modules.
 * Please use the regular try-catch pattern.
 */
export class Ok<T> {
  constructor(public value: T) {
    deprecateOkErr();
  }
}

/**
 * @deprecated
 * The usage of the Ok/Err pattern is deprecated because of the danger of mismatched 'instanceof' types in node_modules.
 * Please use the regular try-catch pattern.
 */
export const ok = <T>(value: T): Ok<T> => new Ok(value);

/**
 * @deprecated
 * The usage of the Ok/Err pattern is deprecated because of the danger of mismatched 'instanceof' types in node_modules.
 * Please use the regular try-catch pattern.
 */
export class Err<T> {
  constructor(public value: T) {
    deprecateOkErr();
  }
}

/**
 * @deprecated
 * The usage of the Ok/Err pattern is deprecated because of the danger of mismatched 'instanceof' types in node_modules.
 * Please use the regular try-catch pattern.
 */
export const err = <T>(value: T): Err<T> => new Err(value);

type KeysOfType<T, U> = { [K in keyof T]: T[K] extends U ? K : never }[keyof T];
type RequiredKeys<T> = Exclude<KeysOfType<T, Exclude<T[keyof T], undefined>>, undefined>;
type OptionalKeys<T> = Exclude<keyof T, RequiredKeys<T>>;
export type ToRequired<T> = {
  [K in OptionalKeys<T>]: T[K] extends undefined | infer U ? U : T[K];
};

export type ToOptional<T> = { [K in keyof T]?: T[K] };

export type JSONValue = string | number | boolean | null | { [key: string]: JSONValue } | JSONValue[];

export type MaybePromise<T> = T | Promise<T>;

export * from "./types/generated";
