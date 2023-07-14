export function attachTouchListener(cb: () => void): () => void {
  function listener() {
    cb();
    window.removeEventListener("touchstart", listener);
  }

  window.addEventListener("touchstart", listener);

  return () => window.removeEventListener("touchstart", listener);
}
