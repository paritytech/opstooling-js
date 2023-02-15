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
export declare function findFreePorts(amount: number): Promise<number[]>;
/**
 * Tries to connect to port, and resolves to `true` if successful.
 * Designed to be used together with `until` function from neighbour `time` module.
 */
export declare function pingPort(host: string, port: number): Promise<boolean>;
