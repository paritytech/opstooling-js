"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.until = exports.delay = void 0;
const delay = (milliseconds) => new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
});
exports.delay = delay;
async function until(cb, interval, maxRetries = Infinity, timeoutMessage) {
    let retryCount = 0;
    while (retryCount < maxRetries) {
        const res = await cb();
        if (res) {
            return;
        }
        await (0, exports.delay)(interval);
        retryCount++;
    }
    throw new Error(timeoutMessage ?? "Maximun retry count reached");
}
exports.until = until;
//# sourceMappingURL=time.js.map