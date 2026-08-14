export function registerServiceWorker() {
  if (!import.meta.env.PROD || !("serviceWorker" in navigator)) return;

  window.addEventListener("load", () => {
    const serviceWorkerUrl = new URL("sw.js", document.baseURI);
    const scope = new URL("./", document.baseURI).pathname;
    navigator.serviceWorker.register(serviceWorkerUrl, { scope, updateViaCache: "none" }).catch(() => {
      // The app remains fully usable when service workers are unavailable.
    });
  });
}
