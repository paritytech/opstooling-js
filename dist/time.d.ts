import { MaybePromise } from "./types";
export declare const delay: (milliseconds: number) => Promise<void>;
export declare function until(cb: () => MaybePromise<boolean>, interval: number, maxRetries?: number, timeoutMessage?: string): Promise<void>;
