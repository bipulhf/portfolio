// Building the 3D island in one go blocks the main thread for seconds on a
// mid-range device. These helpers let the build hand the thread back between
// steps so the browser can paint and stay responsive.

export class BuildCancelled extends Error {
  constructor() {
    super("Scene build cancelled");
    this.name = "BuildCancelled";
  }
}

export type Stage = () => Promise<void>;

/** Resolves after the browser has had a chance to paint. */
export function yieldToBrowser(): Promise<void> {
  return new Promise((resolve) => {
    window.requestAnimationFrame(() => window.setTimeout(resolve, 0));
  });
}

/** A stage boundary that also aborts the build when the caller has left. */
export function createStage(signal?: AbortSignal): Stage {
  return async () => {
    if (signal?.aborted) throw new BuildCancelled();
    await yieldToBrowser();
    if (signal?.aborted) throw new BuildCancelled();
  };
}

/** Runs `callback` once the page is done with its own startup work. */
export function whenIdle(callback: () => void, timeout = 800) {
  if (typeof window.requestIdleCallback === "function") {
    const handle = window.requestIdleCallback(() => callback(), { timeout });
    return () => window.cancelIdleCallback(handle);
  }

  const handle = window.setTimeout(callback, 1);
  return () => window.clearTimeout(handle);
}
