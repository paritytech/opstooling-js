import { Logger } from "../logger";
export declare type CliContext = {
    logger: Logger;
};
export declare const runMain: (cb: (ctx: CliContext) => Promise<void>) => void;
