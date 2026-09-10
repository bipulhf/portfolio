// The studio theme pulls in three.js and the island scene. Warming that chunk
// on hover means the switch does not start with a cold download.
let started = false;

export function prefetchStudioScene() {
  if (started) return;
  started = true;
  void import("./studio/workspace-renderer").catch(() => {
    started = false;
  });
}
