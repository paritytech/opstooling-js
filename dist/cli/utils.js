"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMain = void 0;
const commander_1 = require("commander");
const error_1 = require("src/error");
const logger_1 = require("src/logger");
const runMain = (cb) => {
    const logger = new logger_1.Logger({
        name: "opstooling-scripts",
        impl: console,
        minLogLevel: process.env.DEBUG ? "debug" : "info",
        logFormat: null,
    });
    const ctx = { logger };
    cb(ctx).catch((err) => {
        commander_1.program.error((0, error_1.displayError)(err), { exitCode: 1 });
    });
};
exports.runMain = runMain;
//# sourceMappingURL=utils.js.map