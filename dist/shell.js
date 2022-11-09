"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getShellCommandRunner = exports.displayShellCommand = void 0;
const child_process_1 = require("child_process");
const crypto_1 = require("crypto");
const stream_1 = require("stream");
const format_1 = require("./format");
const displayShellCommand = (execPath, args, { itemsToRedact, } = {}) => (0, format_1.redact)(`${execPath} ${args.join(" ")}`, itemsToRedact ?? []);
exports.displayShellCommand = displayShellCommand;
const getShellCommandRunner = (parentLogger, initialConfiguration) => {
    const logger = parentLogger.child({ commandId: (0, crypto_1.randomUUID)() });
    return async (execPath, args, configuration = {}) => await new Promise((resolve, reject) => {
        const { cwd, onChild, shouldTrackProgress, allowedErrorCodes, testAllowedErrorMessage, shouldCaptureAllStreams, stdinInput, } = { ...initialConfiguration, ...configuration };
        const itemsToRedact = [...(initialConfiguration.itemsToRedact ?? []), ...(configuration.itemsToRedact ?? [])];
        const commandDisplayed = (0, exports.displayShellCommand)(execPath, args, { itemsToRedact });
        logger.info(`Executing command ${commandDisplayed}`);
        const child = (0, child_process_1.spawn)(execPath, args, { cwd, stdio: "pipe" });
        if (onChild) {
            onChild(child);
        }
        if (stdinInput) {
            const stdinStream = new stream_1.Readable();
            stdinStream.push(stdinInput);
            stdinStream.push(null);
            stdinStream.pipe(child.stdin);
        }
        const commandOutputBuffer = [];
        const getStreamHandler = (channel) => (data) => {
            const str = itemsToRedact === undefined ? data.toString() : (0, format_1.redact)(data.toString(), itemsToRedact);
            const strTrim = str.trim();
            if (shouldTrackProgress && strTrim) {
                logger.info(strTrim, channel);
            }
            commandOutputBuffer.push([channel, str]);
        };
        child.stdout.on("data", getStreamHandler("stdout"));
        child.stderr.on("data", getStreamHandler("stderr"));
        child.on("close", (exitCode, signal) => {
            logger.info(`Process finished with exit code ${exitCode ?? "??"}${signal ? `and signal ${signal}` : ""}`);
            if (signal) {
                return resolve(new Error(`Process got terminated by signal ${signal}`));
            }
            if (exitCode) {
                const rawStderr = commandOutputBuffer
                    .reduce((acc, [stream, value]) => {
                    if (stream === "stderr") {
                        return `${acc}${value}`;
                    }
                    else {
                        return acc;
                    }
                }, "")
                    .trim();
                const stderr = itemsToRedact === undefined ? rawStderr : (0, format_1.redact)(rawStderr, itemsToRedact);
                if (!allowedErrorCodes?.includes(exitCode) &&
                    (testAllowedErrorMessage === undefined || !testAllowedErrorMessage(stderr))) {
                    return reject(new Error(stderr));
                }
            }
            const outputBuf = shouldCaptureAllStreams
                ? commandOutputBuffer.reduce((acc, [_, value]) => `${acc}${value}`, "")
                : commandOutputBuffer.reduce((acc, [stream, value]) => {
                    if (stream === "stdout") {
                        return `${acc}${value}`;
                    }
                    else {
                        return acc;
                    }
                }, "");
            const rawOutput = outputBuf.trim();
            const output = itemsToRedact === undefined ? rawOutput : (0, format_1.redact)(rawOutput, itemsToRedact);
            resolve(output);
        });
    });
};
exports.getShellCommandRunner = getShellCommandRunner;
//# sourceMappingURL=shell.js.map