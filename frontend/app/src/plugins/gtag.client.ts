import VueGtag from "vue-gtag-next";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const measurementId = config.public.gtagId;

  if (!measurementId) {
    return;
  }

  nuxtApp.vueApp.use(VueGtag, {
    property: {
      id: measurementId,
    },
  });
});
