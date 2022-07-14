export class Ok<T> {
  constructor(public value: T) {}
}

export const ok = <T>(value: T) => {
  return new Ok(value)
}

export class Err<T> {
  constructor(public value: T) {}
}

export const err = <T>(value: T) => {
  return new Err(value)
}

type KeysOfType<T, U> = { [K in keyof T]: T[K] extends U ? K : never }[keyof T]
type RequiredKeys<T> = Exclude<
  KeysOfType<T, Exclude<T[keyof T], undefined>>,
  undefined
>
type OptionalKeys<T> = Exclude<keyof T, RequiredKeys<T>>
export type ToRequired<T> = {
  [K in OptionalKeys<T>]: T[K] extends undefined | infer U ? U : T[K]
}

export type ToOptional<T> = { [K in keyof T]?: T[K] }

export type JSONValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JSONValue }
  | JSONValue[]

export * from "./types/generated"
