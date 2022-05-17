import { ChildProcess, spawn } from "child_process"
import { randomUUID } from "crypto"
import { readFile } from "fs/promises"
import { Readable as ReadableStream } from "stream"

import { redact } from "./format"
import { Logger } from "./logger"

export const displayShellCommand = (
  execPath: string,
  args: string[],
  {
    itemsToRedact,
  }: {
    itemsToRedact?: string[]
  } = {},
) => {
  return redact(`${execPath} ${args.join(" ")}`, itemsToRedact ?? [])
}

export const tryReadFile = async (...args: Parameters<typeof readFile>) => {
  try {
    return (await readFile(...args)).toString().trim()
  } catch (error) {
    if (
      /*
      Test for the following error:
        [Error: ENOENT: no such file or directory, open '/foo'] {
          errno: -2,
          code: 'ENOENT',
          syscall: 'unlink',
          path: '/foo'
        }
      */
      !(error instanceof Error) ||
      (error as { code?: string })?.code !== "ENOENT"
    ) {
      throw error
    }
  }
}

type ShellCommandRunnerConfiguration = {
  itemsToRedact?: string[]
  shouldTrackProgress?: boolean
  cwd?: string
  onChild?: (child: ChildProcess) => void
}
export const getShellCommandRunner = (
  parentLogger: Logger,
  initialConfiguration: ShellCommandRunnerConfiguration,
) => {
  const logger = parentLogger.child({ commandId: randomUUID() })

  return async (
    execPath: string,
    args: string[],
    configuration: ShellCommandRunnerConfiguration & {
      allowedErrorCodes?: number[]
      testAllowedErrorMessage?: (stderr: string) => boolean
      shouldCaptureAllStreams?: boolean
      stdinInput?: string
      itemsToRedact?: string[]
    } = {},
  ) => {
    return new Promise<string | Error>((resolve, reject) => {
      const {
        cwd,
        onChild,
        shouldTrackProgress,
        allowedErrorCodes,
        testAllowedErrorMessage,
        shouldCaptureAllStreams,
        stdinInput,
      } = { ...initialConfiguration, ...configuration }

      const itemsToRedact = [
        ...(initialConfiguration.itemsToRedact ?? []),
        ...(configuration.itemsToRedact ?? []),
      ]

      const commandDisplayed = displayShellCommand(execPath, args, {
        itemsToRedact,
      })
      logger.info(`Executing command ${commandDisplayed}`)

      const child = spawn(execPath, args, { cwd, stdio: "pipe" })
      if (onChild) {
        onChild(child)
      }

      if (stdinInput) {
        const stdinStream = new ReadableStream()
        stdinStream.push(stdinInput)
        stdinStream.push(null)
        stdinStream.pipe(child.stdin)
      }

      const commandOutputBuffer: ["stdout" | "stderr", string][] = []
      const getStreamHandler = (channel: "stdout" | "stderr") => {
        return (data: { toString: () => string }) => {
          const str =
            itemsToRedact === undefined
              ? data.toString()
              : redact(data.toString(), itemsToRedact)
          const strTrim = str.trim()

          if (shouldTrackProgress && strTrim) {
            logger.info(strTrim, channel)
          }

          commandOutputBuffer.push([channel, str])
        }
      }
      child.stdout.on("data", getStreamHandler("stdout"))
      child.stderr.on("data", getStreamHandler("stderr"))

      child.on("close", (exitCode, signal) => {
        logger.info(
          `Process finished with exit code ${exitCode ?? "??"}${
            signal ? `and signal ${signal}` : ""
          }`,
        )

        if (signal) {
          return resolve(
            new Error(`Process got terminated by signal ${signal}`),
          )
        }

        if (exitCode) {
          const rawStderr = commandOutputBuffer
            .reduce((acc, [stream, value]) => {
              if (stream === "stderr") {
                return `${acc}${value}`
              } else {
                return acc
              }
            }, "")
            .trim()
          const stderr =
            itemsToRedact === undefined
              ? rawStderr
              : redact(rawStderr, itemsToRedact)
          if (
            !allowedErrorCodes?.includes(exitCode) &&
            (testAllowedErrorMessage === undefined ||
              !testAllowedErrorMessage(stderr))
          ) {
            return reject(new Error(stderr))
          }
        }

        const outputBuf = shouldCaptureAllStreams
          ? commandOutputBuffer.reduce((acc, [_, value]) => {
              return `${acc}${value}`
            }, "")
          : commandOutputBuffer.reduce((acc, [stream, value]) => {
              if (stream === "stdout") {
                return `${acc}${value}`
              } else {
                return acc
              }
            }, "")
        const rawOutput = outputBuf.trim()
        const output =
          itemsToRedact === undefined
            ? rawOutput
            : redact(rawOutput, itemsToRedact)

        resolve(output)
      })
    })
  }
}
