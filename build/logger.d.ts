import type { FastifyLoggerInstance } from "fastify";
declare type LoggingImplementation = {
    log: (...args: any[]) => void;
    error: (...args: any[]) => void;
};
declare enum LoggingLevel {
    trace = 0,
    debug = 1,
    info = 2,
    warn = 3,
    error = 4,
    fatal = 5
}
declare type LoggingLevels = keyof typeof LoggingLevel;
export declare class Logger {
    options: {
        name: string;
        logFormat: "json" | null;
        minLogLevel: LoggingLevels;
        impl: LoggingImplementation;
        context?: Record<string, any>;
    };
    constructor(options: {
        name: string;
        logFormat: "json" | null;
        minLogLevel: LoggingLevels;
        impl: LoggingImplementation;
        context?: Record<string, any>;
    });
    getFastifyLogger(): FastifyLoggerInstance;
    child(context: Record<string, unknown>): Logger;
    log<T = string>(level: LoggingLevels, item: unknown, description?: T, ...extra: unknown[]): void;
    private loggerCallback;
    info: <T = string>(item: unknown, description?: T | undefined, ...extra: unknown[]) => void;
    warn: <T = string>(item: unknown, description?: T | undefined, ...extra: unknown[]) => void;
    error: <T = string>(item: unknown, description?: T | undefined, ...extra: unknown[]) => void;
    fatal: <T = string>(item: unknown, description?: T | undefined, ...extra: unknown[]) => void;
}
export {};
