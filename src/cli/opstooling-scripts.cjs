#!/usr/bin/env node
const path = require("path")
const childProcess = require("child_process")

const root = path.join(__dirname, "..", "..")
const mainScript = path.join(__dirname, "main.ts")

childProcess.execFileSync(
  process.argv[0],
  [
    "-r",
    "ts-node/register/transpile-only",
    "-r",
    "tsconfig-paths/register",
    mainScript,
    ...process.argv.slice(2),
  ],
  { cwd: root, stdio: "inherit" },
)
