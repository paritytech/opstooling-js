# Introduction

This repository hosts shared functionality for
[OpsTooling](https://github.com/orgs/paritytech/teams/opstooling) projects.

# Installation

Choose a [tag](https://github.com/paritytech/opstooling-js/tags) and then run

Yarn: `yarn add https://github.com/paritytech/opstooling-js#${TAG_NAME}`

NPM: `npm install https://github.com/paritytech/opstooling-js-style#${TAG_NAME}`

# Release

Trigger the [Release workflow](https://github.com/paritytech/opstooling-js/actions/workflows/release.yml)
which will create a tag with the version passed as input.

# CLI

This package adds `opstooling-scripts` executable, which is "umbrella" for arbitrary subcommands that we might want to share across projects.  

See `opstooling-scripts -h` to get a list of available commands, also check out `src/cli` directory for sources 

### Adding new CLI command
* define new command in `src/cli/commands`, use existing ones as example
* add it to `src/cli/main.ts`
* optionally, update this README.md file

### opstooling-scripts generate-types
We utilize [joi-to-typescript](https://www.npmjs.com/package/joi-to-typescript) to define types together with validation schemas.  

#### To add this functionality to a project:
* define Joi schemas in `src/schemas` (see `src/schemas` in this repo as an example)
* add `src/types/generated` folder for the generated types
* call `opstooling-scripts generate-types --schemas src/schemas --out src/types/generated` to generate types (makes sense to add it to `scripts` in `package.json`)
* add `export * from "./types/generated"` to `src/types.ts` if needed
* commit generated types to repository

#### How to use generated types with validation
```ts
import { validate } from "opstooling-js"

import { YourType } from "src/types"
import { YourTypeSchema } from "src/schemas/YourTypeSchema"

const input: unknown = getSomeData()

const item = validate<YourType>(input, YourTypeSchema)
```
