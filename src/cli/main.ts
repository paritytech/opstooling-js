#!/usr/bin/env node
import "./commands/generate-types.js"
import { program } from "commander"

program.description("shared scripts between OpsTooling projects")

program.parse()
