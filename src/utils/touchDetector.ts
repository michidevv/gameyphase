export function attachTouchListener(cb: () => void) {
  window.addEventListener("touchstart", function listener() {
    cb();
    window.removeEventListener("touchstart", listener);
  });
}
