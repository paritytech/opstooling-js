#!/usr/bin/env node
"use strict";

// src/cli/commands/generate-types.ts
var import_child_process = require("child_process");
var import_commander2 = require("commander");
var import_joi_to_typescript = require("joi-to-typescript");

// src/cli/utils.ts
var import_commander = require("commander");

// src/error.ts
var intoError = (value) => {
  if (value instanceof Error) {
    return value;
  }
  return new Error(String(value));
};
var displayError = (value) => {
  const error = intoError(value);
  return `${error.toString()}${error.stack ? `
${error.stack}` : ""}`;
};

// src/logger.ts
var import_util = require("util");

// src/normalization.ts
var normalizers = {
  symbol: (value) => value.toString(),
  bigint: (value) => value.toString(),
  undefined: () => void 0,
  function: () => void 0,
  boolean: (value) => value,
  number: (value) => value,
  string: (value) => value,
  object: (value, previousObjects = [], showTopLevel = false) => {
    if (value === null) {
      return;
    }
    previousObjects = previousObjects.concat([value]);
    const isArray = Array.isArray(value);
    const isIterable = !isArray && Symbol.iterator in value;
    const objAsArray = isArray ? value : isIterable ? Array.from(value) : void 0;
    if (objAsArray === void 0 && !(value instanceof Error)) {
      const asString = typeof value.toString === "function" && value.toString.length === 0 ? value.toString() : void 0;
      if (typeof asString === "string" && asString !== "[object Object]") {
        return asString;
      }
    }
    const { container, output } = (() => {
      if (isIterable) {
        const iteratorContainer = { type: value.constructor.name, items: [] };
        return { container: iteratorContainer, output: iteratorContainer.items };
      }
      const outputObj = objAsArray === void 0 ? {} : [];
      return { container: outputObj, output: outputObj };
    })();
    const sourceObj = objAsArray ?? value;
    for (const key of Object.getOwnPropertyNames(sourceObj)) {
      setNormalizedKeyValue(sourceObj, output, key, previousObjects);
    }
    if (Object.keys(output).length > 0) {
      return container;
    } else if (showTopLevel) {
      return objAsArray ? [] : {};
    }
  }
};
var setNormalizedKeyValue = (source, output, key, previousObjects) => {
  if (previousObjects.indexOf(source[key]) !== -1) {
    return "[Circular]";
  }
  const value = normalizeValue(source[key], previousObjects);
  if (value === void 0) {
    return;
  }
  output[key] = value;
};
var normalizeValue = (value, previousObjects = [], showTopLevel = false) => normalizers[typeof value](value, previousObjects, showTopLevel);

// src/logger.ts
var LoggingLevel = /* @__PURE__ */ ((LoggingLevel2) => {
  LoggingLevel2[LoggingLevel2["trace"] = 0] = "trace";
  LoggingLevel2[LoggingLevel2["debug"] = 1] = "debug";
  LoggingLevel2[LoggingLevel2["info"] = 2] = "info";
  LoggingLevel2[LoggingLevel2["warn"] = 3] = "warn";
  LoggingLevel2[LoggingLevel2["error"] = 4] = "error";
  LoggingLevel2[LoggingLevel2["fatal"] = 5] = "fatal";
  return LoggingLevel2;
})(LoggingLevel || {});
var Logger = class {
  constructor(options) {
    this.options = options;
    this.info = this.loggerCallback("info");
    this.warn = this.loggerCallback("warn");
    this.error = this.loggerCallback("error");
    this.fatal = this.loggerCallback("fatal");
  }
  getFastifyLogger() {
    return {
      ...this,
      debug: this.loggerCallback("debug"),
      trace: this.loggerCallback("trace"),
      fatal: this.loggerCallback("fatal"),
      child: (context) => this.child(context).getFastifyLogger()
    };
  }
  child(context) {
    const currentContextKeys = Object.keys(this.options.context ?? {});
    const adjustedContext = {};
    for (const [key, value] of Object.entries(context)) {
      let suggestedName = key;
      while (currentContextKeys.includes(suggestedName)) {
        suggestedName = `${suggestedName} (${new Date().toISOString()})`;
      }
      adjustedContext[suggestedName] = value;
      currentContextKeys.push(suggestedName);
    }
    return new Logger({
      ...this.options,
      context: currentContextKeys.length ? { ...this.options.context, ...adjustedContext } : void 0
    });
  }
  log(level, item, description, ...extra) {
    if (LoggingLevel[level] < LoggingLevel[this.options.minLogLevel]) {
      return;
    }
    const loggingFunction = (() => {
      switch (level) {
        case "trace":
        case "debug":
        case "info":
        case "warn": {
          return this.options.impl.log;
        }
        case "fatal":
        case "error": {
          return this.options.impl.error;
        }
        default: {
          const exhaustivenessCheck = level;
          throw new Error(`Not exhaustive: ${exhaustivenessCheck}`);
        }
      }
    })();
    switch (this.options.logFormat) {
      case "json": {
        loggingFunction(
          JSON.stringify({
            level,
            name: this.options.name,
            context: this.options.context,
            msg: normalizeValue(item, [], true),
            description,
            extra
          })
        );
        break;
      }
      case null: {
        const tag = `${level.toUpperCase()} (${this.options.name}):`;
        const normalizedContext = normalizeValue(this.options.context);
        loggingFunction(
          tag,
          ...description === void 0 ? [] : [description],
          ...normalizedContext === void 0 ? [] : ["~@ Context:", normalizedContext],
          ...extra.length === 0 ? [] : ["~@ Extra:", normalizeValue(extra)],
          normalizeValue(item, [], true)
        );
        break;
      }
      default: {
        const exhaustivenessCheck = this.options.logFormat;
        throw new Error(`Not exhaustive: ${exhaustivenessCheck}`);
      }
    }
  }
  fmt(item) {
    return (0, import_util.inspect)(item, { showHidden: false, depth: null, maxArrayLength: null, sorted: true });
  }
  loggerCallback(level) {
    return (item, description, ...extra) => this.log(level, item, description, ...extra);
  }
};

// src/cli/utils.ts
var runMain = (cb) => {
  const logger = new Logger({
    name: "opstooling-scripts",
    impl: console,
    minLogLevel: process.env.DEBUG ? "debug" : "info",
    logFormat: null
  });
  const ctx = { logger };
  cb(ctx).catch((err) => {
    import_commander.program.error(displayError(err), { exitCode: 1 });
  });
};

// src/cli/commands/generate-types.ts
import_commander2.program.command("generate-types").description("Generate type definitions from Joi schemas").requiredOption("--schemas <schema-dir>", "path to directory containing Joi schemas").requiredOption("--out <out-dir>", "path to generated types directory").option("--no-prettier", "apply prettier to generated files", true).action(
  (options) => runMain(async (ctx) => {
    ctx.logger.info("Generating types");
    await (0, import_joi_to_typescript.convertFromDirectory)({
      schemaDirectory: options.schemas,
      indexAllToRoot: true,
      schemaFileSuffix: "Schema",
      typeOutputDirectory: options.out,
      debug: true
    });
    if (options.prettier) {
      ctx.logger.info("Applying prettier to generated files");
      (0, import_child_process.execFileSync)("prettier", ["--write", options.out], { stdio: "inherit" });
    }
    ctx.logger.info("Done");
  })
);

// src/cli/main.ts
var import_commander3 = require("commander");
import_commander3.program.description("shared scripts between OpsTooling projects");
import_commander3.program.parse();
