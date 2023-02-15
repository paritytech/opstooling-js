"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pingPort = exports.findFreePorts = void 0;
const net = __importStar(require("net"));
/**
 * As we need to find unused ports for testing of our bots, we also need to know them in the test environment,
 *  which means that we can't just let bot listen on port 0,
 *  because we don't have a proper backchannel to understand which ports are used
 *
 *  This function spawns `net.server`s on port 0, gets, which ports they used, and frees it.
 *  Unlike using port 0, this approach doesn't really guarantee that port will be free until app starts listening,
 *  but should be pretty stable
 *
 *  A caveat here: if you free a port and try getting a new one in a row, you might get the same one,
 *  thus, spawning multiple servers together, and closing them together as well
 */
async function findFreePorts(amount) {
    const servers = [];
    while (servers.length < amount) {
        servers.push(net.createServer());
    }
    const ports = await Promise.all(servers.map((srv) => new Promise((res, rej) => srv.listen(0, () => {
        const addr = srv.address();
        if (addr === null || typeof addr === "string") {
            rej(addr);
        }
        else {
            res(addr.port);
        }
    }))));
    await Promise.all(servers.map((srv) => new Promise((res) => srv.close(() => res()))));
    return ports;
}
exports.findFreePorts = findFreePorts;
/**
 * Tries to connect to port, and resolves to `true` if successful.
 * Designed to be used together with `until` function from neighbour `time` module.
 */
function pingPort(host, port) {
    const conn = net.connect({ port, host, allowHalfOpen: false });
    return new Promise((resolve) => {
        conn.once("connect", () => {
            conn.destroy();
            resolve(true);
        });
        conn.once("error", () => resolve(false));
    });
}
exports.pingPort = pingPort;
//# sourceMappingURL=net.js.map