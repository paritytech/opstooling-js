/// <reference types="node" />
/// <reference types="node" />
import { ChildProcess } from "child_process";
import { Logger } from "./logger";
export declare const displayShellCommand: (execPath: string, args: string[], { itemsToRedact, }?: {
    itemsToRedact?: string[] | undefined;
}) => string;
declare type ShellCommandRunnerConfiguration = {
    itemsToRedact?: string[];
    shouldTrackProgress?: boolean;
    cwd?: string;
    onChild?: (child: ChildProcess) => void;
};
declare type ShellCommandRunner = (execPath: string, args: string[], configuration?: ShellCommandRunnerConfiguration & {
    allowedErrorCodes?: number[];
    testAllowedErrorMessage?: (stderr: string) => boolean;
    shouldCaptureAllStreams?: boolean;
    stdinInput?: string;
    itemsToRedact?: string[];
}) => Promise<string | Error>;
export declare const getShellCommandRunner: (parentLogger: Logger, initialConfiguration: ShellCommandRunnerConfiguration) => ShellCommandRunner;
export declare function killAndWait(cp: ChildProcess, signal?: NodeJS.Signals | number): Promise<void>;
export declare function writePidfile(cp: ChildProcess, path: string): Promise<void>;
export declare function ensureDeadByPidfile(path: string, signal?: NodeJS.Signals): Promise<void>;
export {};
