/// <reference types="node" />
import type { FastifyLoggerInstance } from "fastify";
export declare type LoggingImplementation = {
    log: (...args: unknown[]) => void;
    error: (...args: unknown[]) => void;
};
export declare enum LoggingLevel {
    trace = 0,
    debug = 1,
    info = 2,
    warn = 3,
    error = 4,
    fatal = 5
}
export declare type LoggingLevels = keyof typeof LoggingLevel;
export declare type LoggerOptions = {
    name: string;
    logFormat: "json" | null;
    minLogLevel: LoggingLevels;
    impl: LoggingImplementation | Console;
    context?: Record<string, unknown>;
};
export declare class Logger {
    options: LoggerOptions;
    constructor(options: LoggerOptions);
    getFastifyLogger(): FastifyLoggerInstance;
    child(context: Record<string, unknown>): Logger;
    log<T = string>(level: LoggingLevels, item: unknown, description?: T, ...extra: unknown[]): undefined | (() => void);
    fmt(item: unknown): string;
    private loggerCallback;
    debug: <T = string>(item: unknown, description?: T | undefined, ...extra: unknown[]) => (() => void) | undefined;
    info: <T = string>(item: unknown, description?: T | undefined, ...extra: unknown[]) => (() => void) | undefined;
    warn: <T = string>(item: unknown, description?: T | undefined, ...extra: unknown[]) => (() => void) | undefined;
    error: <T = string>(item: unknown, description?: T | undefined, ...extra: unknown[]) => (() => void) | undefined;
    fatal: <T = string>(item: unknown, description?: T | undefined, ...extra: unknown[]) => (() => void) | undefined;
}
