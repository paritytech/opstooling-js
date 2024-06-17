/**
 * A helper function that checks the metadata version / runtime version in intervals.
 * If a change is detected, an appropriate callback is executed.
 *
 * @param opts.metadata Options to restart upon metadata version change.
 * @param opts.runtime Options to restart upon runtime hash change.
 * @param opts.log Optional function to log the output.
 * @param opts.checkIntervalSeconds How often to check for changes. 10 minutes by default.
 * @returns A function to stop and cleanup the restarter.
 *
 * @example
 * runtimeRestarter({
 *   metadata: {
 *     getMetadataVersion: async () => (await api.rpc.state.getMetadata()).version.toString(),
 *     onMetadataChange: () => process.exit(1),
 *   },
 *   runtime: {
 *     getRuntimeVersionHash: async () => (await api.rpc.state.getRuntimeVersion()).hash.toString(),
 *     onRuntimeChange: () => process.exit(1),
 *   }
 *   log: (msg) => console.log(msg)
 * })
 */
export function runtimeRestarter(opts: {
  metadata?: {
    getMetadataVersion: () => Promise<string>;
    onMetadataChange: () => void | Promise<void>;
  };
  runtime?: {
    getRuntimeVersionHash: () => Promise<string>;
    onRuntimeChange: () => void | Promise<void>;
  };
  log?: (msg: string) => void;
  checkIntervalSeconds?: number;
}): () => void {
  const { metadata, runtime, log } = opts;

  log?.("Starting the runtime restarter");
  if (!metadata && runtime) {
    log?.("No options specified for either metadata or runtime. There is nothing to be done.");
    return () => {};
  }

  let initialMetadataVersion: string | null = null;
  let initialRuntimeVersionHash: string | null = null;

  const runChecks = async () => {
    if (metadata) {
      initialMetadataVersion = initialMetadataVersion ?? (await metadata.getMetadataVersion());

      const currentMetadataVersion = await metadata.getMetadataVersion();
      if (currentMetadataVersion !== initialMetadataVersion) {
        log?.(`Metadata version has changed!\nInitial: ${initialMetadataVersion}\nCurrent: ${currentMetadataVersion}`);
        void metadata.onMetadataChange();
      }
    }

    if (runtime) {
      initialRuntimeVersionHash = initialRuntimeVersionHash ?? (await runtime.getRuntimeVersionHash());

      const currentRuntimeVersionHash = await runtime.getRuntimeVersionHash();
      if (currentRuntimeVersionHash !== initialRuntimeVersionHash) {
        log?.(
          `Runtime version hash has changed!\nInitial: ${initialRuntimeVersionHash}\nCurrent: ${currentRuntimeVersionHash}`,
        );
        void runtime.onRuntimeChange();
      }
    }
  };

  const tryRunChecks = async () => {
    try {
      await runChecks();
    } catch (e) {
      if (e instanceof Error && e.message.includes("WebSocket is not connected")) {
        log?.("Failed to check for metadata/runtime changes due to disconnected websocket. Will continue trying.");
        return;
      }
      throw e;
    }
  };

  const checkIntervalSeconds = opts.checkIntervalSeconds ?? 600;
  const interval = setInterval(() => {
    void tryRunChecks();
  }, checkIntervalSeconds * 1000);

  return () => clearInterval(interval);
}
