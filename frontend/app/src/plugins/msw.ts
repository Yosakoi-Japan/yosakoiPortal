export default defineNuxtPlugin(async () => {
  if (import.meta.server) {
    return;
  }

  const { worker } = await import("~/mocks/browser");

  // TODO:local環境でのみMSWを有効にする
  await worker.start({
    onUnhandledRequest: "bypass",
  });
});
