#!/usr/bin/env node
const path = require("path")
const childProcess = require("child_process")

const root = path.join(__dirname, "..", "..")
const mainScript = path.join(__dirname, "main.ts")

// Dependencies for CLI scripts live here, let's add local node_modules to NODE_PATH
const localNodeModules = path.normalize(path.join(root, "node_modules"))
const updatedNodePath = process.env.NODE_PATH ? process.env.NODE_PATH + ":" : "" + localNodeModules

const tsconfigPath = path.join(root, "tsconfig.json")

childProcess.execFileSync(
  "ts-node",
  ["--project", tsconfigPath, "--transpileOnly", "-r", "tsconfig-paths/register", mainScript, ...process.argv.slice(2)],
  { stdio: "inherit", env: { ...process.env, NODE_PATH: updatedNodePath } },
)
