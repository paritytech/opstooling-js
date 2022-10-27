#!/usr/bin/env node
import "./commands/generate-types"
import { program } from "commander"

program.description("shared scripts between OpsTooling projects")

program.parse()
