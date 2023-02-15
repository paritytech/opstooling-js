"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureDeadByPidfile = exports.writePidfile = exports.killAndWait = exports.getShellCommandRunner = exports.displayShellCommand = void 0;
const child_process_1 = require("child_process");
const crypto_1 = require("crypto");
const fs_1 = require("fs");
const stream_1 = require("stream");
const format_1 = require("./format");
const time_1 = require("./time");
const displayShellCommand = (execPath, args, { itemsToRedact, } = {}) => (0, format_1.redact)(`${execPath} ${args.join(" ")}`, itemsToRedact ?? []);
exports.displayShellCommand = displayShellCommand;
const getShellCommandRunner = (parentLogger, initialConfiguration) => {
    const logger = parentLogger.child({ commandId: (0, crypto_1.randomUUID)() });
    return async (execPath, args, configuration = {}) => await new Promise((resolve, reject) => {
        const { cwd, onChild, shouldTrackProgress, allowedErrorCodes, testAllowedErrorMessage, shouldCaptureAllStreams, stdinInput, } = { ...initialConfiguration, ...configuration };
        const itemsToRedact = [...(initialConfiguration.itemsToRedact ?? []), ...(configuration.itemsToRedact ?? [])];
        const commandDisplayed = (0, exports.displayShellCommand)(execPath, args, { itemsToRedact });
        logger.info(`Executing command "${commandDisplayed}"`);
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
            logger.info(`Process "${commandDisplayed}" finished with exit code ${exitCode ?? "??"}${signal ? `and signal ${signal}` : ""}`);
            if (signal) {
                return resolve(new Error(`Process "${commandDisplayed}" got terminated by signal ${signal}`));
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
async function killAndWait(cp, signal) {
    const p = new Promise((resolve) => cp.on("exit", resolve));
    cp.kill(signal ?? "SIGTERM");
    await Promise.race([(0, time_1.until)(() => cp.exitCode !== null, 100), p]);
}
exports.killAndWait = killAndWait;
async function writePidfile(cp, path) {
    if (cp.pid === undefined) {
        throw new Error("Can't write pidfile, .pid is undefined");
    }
    await fs_1.promises.writeFile(path, String(cp.pid));
}
exports.writePidfile = writePidfile;
async function ensureDeadByPidfile(path, signal = "SIGTERM") {
    const pidfileContents = await fs_1.promises.readFile(path, "utf8").catch((err) => {
        if (err.code === "ENOENT")
            return undefined;
        throw err;
    });
    if (!pidfileContents)
        return;
    const pid = parseInt(pidfileContents, 10);
    if (isNaN(pid)) {
        throw new Error(`Can not get numeric pid from following contents: ${pidfileContents}`);
    }
    // TODO: make this configurable if needed
    for (let i = 0; i < 10; i++) {
        try {
            process.kill(pid, signal);
        }
        catch (e) {
            break;
        }
        await (0, time_1.delay)(250);
    }
}
exports.ensureDeadByPidfile = ensureDeadByPidfile;
//# sourceMappingURL=shell.js.map