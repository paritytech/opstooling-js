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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.err = exports.Err = exports.ok = exports.Ok = void 0;
class Ok {
    constructor(value) {
        this.value = value;
    }
}
exports.Ok = Ok;
const ok = (value) => new Ok(value);
exports.ok = ok;
class Err {
    constructor(value) {
        this.value = value;
    }
}
exports.Err = Err;
const err = (value) => new Err(value);
exports.err = err;
__exportStar(require("./types/generated"), exports);
//# sourceMappingURL=types.js.map