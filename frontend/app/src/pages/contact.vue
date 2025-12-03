<template>
  <div class="min-h-screen bg-gray-50">
    <Header />

    <main class="container mx-auto flex items-center justify-center px-4 py-16">
      <section
        class="w-full max-w-3xl rounded-3xl bg-white p-8 text-gray-900 shadow-2xl ring-1 ring-gray-100 md:p-10"
      >
        <p class="text-sm font-semibold text-pink-600">メールサポート</p>
        <h1 class="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
          お問い合わせメールアドレス
        </h1>
        <p class="mt-4 text-base text-gray-600 md:text-lg">
          下記のメールアドレス宛に、ご用件と必要事項をご記入のうえお送りください。
        </p>

        <div
          class="mt-8 rounded-2xl bg-gradient-to-r from-red-50 to-pink-50 p-6"
        >
          <p class="text-sm text-gray-500">メールアドレス</p>
          <p class="mt-2 text-2xl font-semibold text-red-600 md:text-3xl">
            {{ contactEmail }}
          </p>
        </div>

        <a
          class="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-red-500 px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-red-600 md:w-auto"
          :href="`mailto:${contactEmail}`"
        >
          メールアプリを開く
          <svg
            class="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </a>
      </section>
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import Header from "~/components/utils/Header.vue";
import Footer from "~/components/utils/Footer.vue";
import { SITE_NAME, SITE_URL } from "~/constants/seo";

const contactEmail = "yosakoi.portal.contact@gmail.com";
const route = useRoute();

useHead(() => {
  const url = `${SITE_URL}${route.path}`;
  const pageTitle = "お問い合わせ";
  const description =
    "Yosakoi Portalへのお問い合わせはメールで受け付けています。";

  return {
    title: pageTitle,
    meta: [
      { name: "description", content: description },
      { property: "og:title", content: `${pageTitle} | ${SITE_NAME}` },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: `${pageTitle} | ${SITE_NAME}` },
      { name: "twitter:description", content: description },
    ],
    link: [{ rel: "canonical", href: url }],
  };
});
</script>
