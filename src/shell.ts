import { ChildProcess, spawn } from "child_process";
import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import { Readable as ReadableStream } from "stream";

import { redact } from "./format";
import { Logger } from "./logger";
import { delay, until } from "./time";

export const displayShellCommand = (
  execPath: string,
  args: string[],
  {
    itemsToRedact,
  }: {
    itemsToRedact?: string[];
  } = {},
): string => redact(`${execPath} ${args.join(" ")}`, itemsToRedact ?? []);

type ShellCommandRunnerConfiguration = {
  itemsToRedact?: string[];
  shouldTrackProgress?: boolean;
  cwd?: string;
  onChild?: (child: ChildProcess) => void;
};

type ShellCommandRunner = (
  execPath: string,
  args: string[],
  configuration?: ShellCommandRunnerConfiguration & {
    allowedErrorCodes?: number[];
    testAllowedErrorMessage?: (stderr: string) => boolean;
    shouldCaptureAllStreams?: boolean;
    stdinInput?: string;
    itemsToRedact?: string[];
  },
) => Promise<string | Error>;

export const getShellCommandRunner = (
  parentLogger: Logger,
  initialConfiguration: ShellCommandRunnerConfiguration,
): ShellCommandRunner => {
  const logger = parentLogger.child({ commandId: randomUUID() });

  return async (execPath: string, args: string[], configuration: Parameters<ShellCommandRunner>[2] = {}) =>
    await new Promise<string | Error>((resolve, reject) => {
      const {
        cwd,
        onChild,
        shouldTrackProgress,
        allowedErrorCodes,
        testAllowedErrorMessage,
        shouldCaptureAllStreams,
        stdinInput,
      } = { ...initialConfiguration, ...configuration };

      const itemsToRedact = [...(initialConfiguration.itemsToRedact ?? []), ...(configuration.itemsToRedact ?? [])];

      const commandDisplayed = displayShellCommand(execPath, args, { itemsToRedact });
      logger.info(`Executing command "${commandDisplayed}"`);

      const child = spawn(execPath, args, { cwd, stdio: "pipe" });
      if (onChild) {
        onChild(child);
      }

      if (stdinInput) {
        const stdinStream = new ReadableStream();
        stdinStream.push(stdinInput);
        stdinStream.push(null);
        stdinStream.pipe(child.stdin);
      }

      const commandOutputBuffer: ["stdout" | "stderr", string][] = [];
      const getStreamHandler = (channel: "stdout" | "stderr") => (data: { toString: () => string }) => {
        const str = itemsToRedact === undefined ? data.toString() : redact(data.toString(), itemsToRedact);
        const strTrim = str.trim();

        if (shouldTrackProgress && strTrim) {
          logger.info(strTrim, channel);
        }

        commandOutputBuffer.push([channel, str]);
      };
      child.stdout.on("data", getStreamHandler("stdout"));
      child.stderr.on("data", getStreamHandler("stderr"));

      child.on("close", (exitCode, signal) => {
        logger.info(
          `Process "${commandDisplayed}" finished with exit code ${exitCode ?? "??"}${
            signal ? `and signal ${signal}` : ""
          }`,
        );

        if (signal) {
          return resolve(new Error(`Process "${commandDisplayed}" got terminated by signal ${signal}`));
        }

        if (exitCode) {
          const rawStderr = commandOutputBuffer
            .reduce((acc, [stream, value]) => {
              if (stream === "stderr") {
                return `${acc}${value}`;
              } else {
                return acc;
              }
            }, "")
            .trim();
          const stderr = itemsToRedact === undefined ? rawStderr : redact(rawStderr, itemsToRedact);
          if (
            !allowedErrorCodes?.includes(exitCode) &&
            (testAllowedErrorMessage === undefined || !testAllowedErrorMessage(stderr))
          ) {
            return reject(new Error(stderr));
          }
        }

        const outputBuf = shouldCaptureAllStreams
          ? commandOutputBuffer.reduce((acc, [_, value]) => `${acc}${value}`, "")
          : commandOutputBuffer.reduce((acc, [stream, value]) => {
              if (stream === "stdout") {
                return `${acc}${value}`;
              } else {
                return acc;
              }
            }, "");
        const rawOutput = outputBuf.trim();
        const output = itemsToRedact === undefined ? rawOutput : redact(rawOutput, itemsToRedact);

        resolve(output);
      });
    });
};

export async function killAndWait(cp: ChildProcess, signal?: NodeJS.Signals | number): Promise<void> {
  const p = new Promise((resolve) => cp.on("exit", resolve));
  cp.kill(signal ?? "SIGTERM");
  await Promise.race([until(() => cp.exitCode !== null, 100), p]);
}

export async function writePidfile(cp: ChildProcess, path: string): Promise<void> {
  if (cp.pid === undefined) {
    throw new Error("Can't write pidfile, .pid is undefined");
  }
  await fs.writeFile(path, String(cp.pid));
}

export async function ensureDeadByPidfile(path: string, signal: NodeJS.Signals = "SIGTERM"): Promise<void> {
  const pidfileContents: string | undefined = await fs.readFile(path, "utf8").catch((err) => {
    if (err.code === "ENOENT") return undefined;
    throw err;
  });

  if (!pidfileContents) return;

  const pid = parseInt(pidfileContents, 10);
  if (isNaN(pid)) {
    throw new Error(`Can not get numeric pid from following contents: ${pidfileContents}`);
  }

  // TODO: make this configurable if needed
  for (let i = 0; i < 10; i++) {
    try {
      process.kill(pid, signal);
    } catch (e) {
      break;
    }
    await delay(250);
  }
}
