"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const commander_1 = require("commander");
const joi_to_typescript_1 = require("joi-to-typescript");
const utils_1 = require("src/cli/utils");
commander_1.program
    .command("generate-types")
    .description("Generate type definitions from Joi schemas")
    .requiredOption("--schemas <schema-dir>", "path to directory containing Joi schemas. Expected to be in `dist` with schemas as .js files")
    .requiredOption("--out <out-dir>", "path to generated types directory")
    .option("--no-prettier", "apply prettier to generated files", true)
    .action((options) => (0, utils_1.runMain)(async (ctx) => {
    ctx.logger.info("Generating types");
    await (0, joi_to_typescript_1.convertFromDirectory)({
        schemaDirectory: options.schemas,
        indexAllToRoot: true,
        schemaFileSuffix: "Schema",
        typeOutputDirectory: options.out,
        inputFileFilter: /.*(Schema\.js)$/,
    });
    if (options.prettier) {
        ctx.logger.info("Applying prettier to generated files");
        (0, child_process_1.execFileSync)("prettier", ["--write", options.out], { stdio: "inherit" });
    }
    ctx.logger.info("Done");
}));
//# sourceMappingURL=generate-types.js.map