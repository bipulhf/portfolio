/** Coalesce high-frequency events (scroll/resize) to one callback per frame. */
export function rafThrottle(callback: () => void) {
  let frame = 0;

  function run() {
    if (frame) return;
    frame = window.requestAnimationFrame(() => {
      frame = 0;
      callback();
    });
  }

  run.cancel = () => {
    if (!frame) return;
    window.cancelAnimationFrame(frame);
    frame = 0;
  };

  return run;
}
