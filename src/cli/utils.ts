import { program } from "commander"

import { Logger } from "src/logger"

export type CliContext = { logger: Logger }

export const runMain = (cb: (ctx: CliContext) => Promise<void>) => {
  const logger = new Logger({
    name: "opstooling-scripts",
    impl: console,
    minLogLevel: process.env.DEBUG ? "debug" : "info",
    logFormat: null,
  })

  const ctx: CliContext = { logger }

  cb(ctx).catch((err) => {
    program.error(
      err instanceof Error ? err.stack ?? err.message : String(err),
      { exitCode: 1 },
    )
  })
}
