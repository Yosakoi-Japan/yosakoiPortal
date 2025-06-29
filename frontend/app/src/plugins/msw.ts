import { worker } from "~/mocks/browser";

export default defineNuxtPlugin(async () => {
  // TODO:local環境でのみMSWを有効にする
  await worker.start({
    onUnhandledRequest: "bypass",
  });
});
