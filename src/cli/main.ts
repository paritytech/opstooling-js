import { program } from "commander"

program.description("shared scripts between OpsTooling projects")

program.executableDir("./commands/")

program.command("generate-types", "generates type definitions from Joi schemas", {
  executableFile: "generate-types.ts",
})

program.parse()
