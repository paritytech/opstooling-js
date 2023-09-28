import type { FastifyLoggerInstance } from "fastify";
import type { Counter } from "prom-client";
import { inspect } from "util";

export type LoggingImplementation = {
  log: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
};

export enum LoggingLevel {
  trace,
  debug,
  info,
  warn,
  error,
  fatal,
}

export type LoggingLevels = keyof typeof LoggingLevel;
export type LoggerOptions = {
  name: string;
  logFormat: "json" | null;
  minLogLevel: LoggingLevels;
  impl: LoggingImplementation | Console;
  context?: Record<string, unknown>;
  metricsCounter?: Counter<"level">;
};

export class Logger {
  #secretsToMask: string[] = [];

  constructor(public options: LoggerOptions) {}

  addSecretsToMask(...secrets: (string | undefined)[]): void {
    for (const value of secrets) {
      if (value !== undefined && value !== "") {
        this.#secretsToMask.push(value);
      }
    }
  }

  getFastifyLogger(): FastifyLoggerInstance {
    return {
      ...this,
      debug: this.loggerCallback("debug"),
      trace: this.loggerCallback("trace"),
      fatal: this.loggerCallback("fatal"),
      child: (context: Record<string, unknown>) => this.child(context).getFastifyLogger(),
    };
  }

  child(context: Record<string, unknown>): Logger {
    /*
      Adjust keys in order to prevent overriding existing data in the context
      with the same key
    */
    const currentContextKeys = Object.keys(this.options.context ?? {});
    const adjustedContext: { [key: string]: unknown } = {};
    for (const [key, value] of Object.entries(context)) {
      let suggestedName = key;
      while (currentContextKeys.includes(suggestedName)) {
        suggestedName = `${suggestedName} (${new Date().toISOString()})`;
      }
      adjustedContext[suggestedName] = value;
      currentContextKeys.push(suggestedName);
    }
    const result = new Logger({
      ...this.options,
      context: currentContextKeys.length ? { ...this.options.context, ...adjustedContext } : undefined,
    });

    result.addSecretsToMask(...this.#secretsToMask);

    return result;
  }

  log<T = string>(level: LoggingLevels, item: unknown, description?: T, ...extra: unknown[]): undefined | (() => void) {
    if (this.options.metricsCounter) {
      this.options.metricsCounter.inc({ level });
    }

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
          const exhaustivenessCheck: never = level;
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
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
            msg: this.fmt(item),
            description: this.fmt(description),
            extra: this.fmt(extra),
          }),
        );
        break;
      }
      case null: {
        const tag = `${level.toUpperCase()} (${this.options.name}):`;
        loggingFunction(
          tag,
          ...(description === undefined ? [] : [this.fmt(description)]),
          ...(this.options.context === undefined ? [] : ["~@ Context:", this.fmt(this.options.context)]),
          ...(extra.length === 0 ? [] : ["~@ Extra:", this.fmt(extra)]),
          this.fmt(item),
        );
        break;
      }
      default: {
        const exhaustivenessCheck: never = this.options.logFormat;
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        throw new Error(`Not exhaustive: ${exhaustivenessCheck}`);
      }
    }
  }

  fmt(item: unknown): string {
    let formatted: string;

    // util.inspect of strings will add another quotes around it, we don't need it for logger
    if (typeof item === "string") {
      formatted = item;
    } else {
      formatted = inspect(item, { showHidden: false, depth: null, maxArrayLength: null, sorted: true });
    }

    for (const secret of this.#secretsToMask) {
      formatted = formatted.replaceAll(secret, "[MASKED]");
    }

    return formatted;
  }

  private loggerCallback(level: LoggingLevels) {
    return <T = string>(item: unknown, description?: T, ...extra: unknown[]) =>
      this.log(level, item, description, ...extra);
  }

  debug = this.loggerCallback("debug");
  info = this.loggerCallback("info");
  warn = this.loggerCallback("warn");
  error = this.loggerCallback("error");
  fatal = this.loggerCallback("fatal");
}
