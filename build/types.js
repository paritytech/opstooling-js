"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Err = exports.Ok = void 0;
class Ok {
    constructor(value) {
        this.value = value;
    }
}
exports.Ok = Ok;
class Err {
    constructor(value) {
        this.value = value;
    }
}
exports.Err = Err;
