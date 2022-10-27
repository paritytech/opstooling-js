import { execFileSync } from "child_process"
import { program } from "commander"
import { convertFromDirectory } from "joi-to-typescript"

import { runMain } from "src/cli/utils"

program
  .description("Generate types from Joi schemas")
  .requiredOption("--schemas <schema-dir>", "path to directory containing Joi schemas")
  .requiredOption("--out <out-dir>", "path to generated types directory")
  .option("--no-prettier", "apply prettier to generated files", true)
  .action((options: { schemas: string; out: string; prettier: boolean }) =>
    runMain(async (ctx) => {
      ctx.logger.info("Generating types")

      await convertFromDirectory({
        schemaDirectory: options.schemas,
        indexAllToRoot: true,
        schemaFileSuffix: "Schema",
        typeOutputDirectory: options.out,
        debug: true,
      })

      if (options.prettier) {
        ctx.logger.info("Applying prettier to generated files")

        execFileSync("prettier", ["--write", options.out], { stdio: "inherit" })
      }

      ctx.logger.info("Done")
    }),
  )
  .parse()
