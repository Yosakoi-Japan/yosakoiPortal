<template>
  <div class="min-h-screen bg-gray-50">
    <Header />
    <main class="container mx-auto max-w-4xl px-4 py-12">
      <section
        class="rounded-3xl bg-white p-8 text-gray-900 shadow-xl ring-1 ring-gray-100"
      >
        <h1 class="text-3xl font-bold text-gray-900 md:text-4xl">
          よさこい祭り掲載のご相談
        </h1>
        <p class="mt-4 text-gray-600 leading-relaxed">
          あなたの街のよさこい祭りをもっと多くの人に知ってもらいませんか？<br />
          開催に込めた想い、見どころ、参加者が感じてほしいポイントなど自由に教えてください。<br />
          いただいた情報は編集部で確認し、掲載の可否をご連絡せず判断する場合がありますが、<br />
          できるだけ多くのお祭りを紹介していきたいと考えています！
        </p>
        <div class="mt-8">
          <div
            class="relative w-full overflow-hidden rounded-2xl border border-gray-200 shadow-inner"
          >
            <iframe
              class="w-full min-h-[2000px] md:min-h-[2600px]"
              src="https://docs.google.com/forms/d/e/1FAIpQLSeVotph72nCO6SWoXAXj1f-_UcQk7ockQ_3zTrBa0VN_tK_Sg/viewform?embedded=true"
              frameborder="0"
              marginheight="0"
              marginwidth="0"
            >
              読み込んでいます…
            </iframe>
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Header from "~/components/utils/Header.vue";
import Footer from "~/components/utils/Footer.vue";
import { SITE_NAME, SITE_URL } from "~/constants/seo";

const route = useRoute();

useHead(() => {
  const pageTitle = "よさこい祭り掲載依頼フォーム";
  const description =
    "Yosakoi Portalにイベント情報を掲載したい方向けの投稿フォームです。必要事項を入力して送信してください。";
  const url = `${SITE_URL}${route.path}`;

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
