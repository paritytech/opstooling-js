export declare class Ok<T> {
    value: T;
    constructor(value: T);
}
export declare const ok: <T>(value: T) => Ok<T>;
export declare class Err<T> {
    value: T;
    constructor(value: T);
}
export declare const err: <T>(value: T) => Err<T>;
declare type KeysOfType<T, U> = {
    [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];
declare type RequiredKeys<T> = Exclude<KeysOfType<T, Exclude<T[keyof T], undefined>>, undefined>;
declare type OptionalKeys<T> = Exclude<keyof T, RequiredKeys<T>>;
export declare type ToRequired<T> = {
    [K in OptionalKeys<T>]: T[K] extends undefined | infer U ? U : T[K];
};
export declare type ToOptional<T> = {
    [K in keyof T]?: T[K];
};
export declare type JSONValue = string | number | boolean | null | {
    [key: string]: JSONValue;
} | JSONValue[];
export declare type MaybePromise<T> = T | Promise<T>;
export * from "./types/generated";
