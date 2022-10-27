#!/usr/bin/env node
import {
  Logger,
  displayError
} from "../chunk-AG6SRFXG.mjs";

// src/cli/commands/generate-types.ts
import { execFileSync } from "child_process";
import { program as program2 } from "commander";
import { convertFromDirectory } from "joi-to-typescript";

// src/cli/utils.ts
import { program } from "commander";
var runMain = (cb) => {
  const logger = new Logger({
    name: "opstooling-scripts",
    impl: console,
    minLogLevel: process.env.DEBUG ? "debug" : "info",
    logFormat: null
  });
  const ctx = { logger };
  cb(ctx).catch((err) => {
    program.error(displayError(err), { exitCode: 1 });
  });
};

// src/cli/commands/generate-types.ts
program2.command("generate-types").description("Generate type definitions from Joi schemas").requiredOption("--schemas <schema-dir>", "path to directory containing Joi schemas").requiredOption("--out <out-dir>", "path to generated types directory").option("--no-prettier", "apply prettier to generated files", true).action(
  (options) => runMain(async (ctx) => {
    ctx.logger.info("Generating types");
    await convertFromDirectory({
      schemaDirectory: options.schemas,
      indexAllToRoot: true,
      schemaFileSuffix: "Schema",
      typeOutputDirectory: options.out,
      debug: true
    });
    if (options.prettier) {
      ctx.logger.info("Applying prettier to generated files");
      execFileSync("prettier", ["--write", options.out], { stdio: "inherit" });
    }
    ctx.logger.info("Done");
  })
);

// src/cli/main.ts
import { program as program3 } from "commander";
program3.description("shared scripts between OpsTooling projects");
program3.parse();
