// The studio theme pulls in StudioHome, three.js, and the island diorama.
// Warming both chunks on hover/focus means switching starts immediately.
let started = false;

export function prefetchStudioScene() {
  if (started) return;
  started = true;
  void Promise.all([
    import("./studio/studio-home"),
    import("./studio/workspace-renderer"),
  ]).catch(() => {
    started = false;
  });
}
