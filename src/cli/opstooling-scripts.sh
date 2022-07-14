#!/usr/bin/env bash

# Using script location as pwd allows to utilize dependencies of opstooling-js,
# namely tsnode and tsconfig-paths.
# `readlink` is important to get around a symlink in node_modules/.bin,
# so we would get actual location of the script
script_dir="$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")"
cd "${script_dir}" || exit 1

node -r ts-node/register/transpile-only -r tsconfig-paths/register "${script_dir}/opstooling-scripts.ts" "${@}"
