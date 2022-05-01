"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const normalizer_1 = require("./normalizer");
var LoggingLevel;
(function (LoggingLevel) {
    LoggingLevel[LoggingLevel["trace"] = 0] = "trace";
    LoggingLevel[LoggingLevel["debug"] = 1] = "debug";
    LoggingLevel[LoggingLevel["info"] = 2] = "info";
    LoggingLevel[LoggingLevel["warn"] = 3] = "warn";
    LoggingLevel[LoggingLevel["error"] = 4] = "error";
    LoggingLevel[LoggingLevel["fatal"] = 5] = "fatal";
})(LoggingLevel || (LoggingLevel = {}));
class Logger {
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
            child: (context) => {
                return this.child(context).getFastifyLogger();
            },
        };
    }
    child(context) {
        /*
          Adjust keys in order to prevent overriding existing data in the context
          with the same key
        */
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
            context: currentContextKeys.length
                ? { ...this.options.context, ...adjustedContext }
                : undefined,
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
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    throw new Error(`Not exhaustive: ${exhaustivenessCheck}`);
                }
            }
        })();
        switch (this.options.logFormat) {
            case "json": {
                loggingFunction(JSON.stringify({
                    level,
                    name: this.options.name,
                    context: this.options.context,
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    msg: (0, normalizer_1.normalizeValue)(item),
                    description,
                    extra,
                }));
                break;
            }
            case null: {
                const tag = `${level.toUpperCase()} (${this.options.name}):`;
                const normalizedContext = (0, normalizer_1.normalizeValue)(this.options.context);
                loggingFunction(tag, ...(description === undefined ? [] : [description]), ...(normalizedContext === undefined
                    ? []
                    : ["~@ Context:", normalizedContext]), ...(extra.length === 0 ? [] : ["~@ Extra:", (0, normalizer_1.normalizeValue)(extra)]), (0, normalizer_1.normalizeValue)(item));
                break;
            }
            default: {
                const exhaustivenessCheck = this.options.logFormat;
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                throw new Error(`Not exhaustive: ${exhaustivenessCheck}`);
            }
        }
    }
    loggerCallback(level) {
        return (item, description, ...extra) => {
            return this.log(level, item, description, ...extra);
        };
    }
}
exports.Logger = Logger;
