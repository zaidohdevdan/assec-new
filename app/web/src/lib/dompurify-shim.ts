// Polyfill node:worker_threads.markAsUncloneable on older Node 20.x runtimes
// before jsdom/undici is loaded by isomorphic-dompurify during SSR/build.
if (typeof window === "undefined") {
  try {
    const req = eval("require") as NodeRequire;
    const wt = req("node:worker_threads");
    if (wt && typeof wt.markAsUncloneable !== "function") {
      wt.markAsUncloneable = () => {};
    }
  } catch {
    // Ignore in edge/browser environments
  }
}
export {};
