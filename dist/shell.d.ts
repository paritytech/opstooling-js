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
export {};
