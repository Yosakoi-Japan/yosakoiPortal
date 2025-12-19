<template>
  <div class="min-h-screen bg-gray-50">
    <Header />
    <main class="container mx-auto max-w-4xl px-4 py-12">
      <section class="space-y-10">
        <div
          class="rounded-3xl bg-white p-8 text-gray-900 shadow-xl ring-1 ring-gray-100"
        >
          <p class="text-sm font-semibold text-pink-600 mb-2">
            掲載パートナー募集中
          </p>
          <h1 class="text-3xl font-bold text-gray-900 md:text-4xl">
            あなたのよさこい祭りで、見る人の心を動かそう
          </h1>
          <p class="mt-4 text-gray-600 leading-relaxed">
            「もっと多くの人に見てもらいたい」「地域を盛り上げたい」そんな想いをYosakoi
            Portalに託してみませんか！？<br />
            祭り誕生の背景や演舞のこだわり、参加者に届けたいメッセージを自由に記入してください。<br />
            丁寧にチェックし、順次掲載や特集へのピックアップを進めていきます。
          </p>
        </div>

        <div
          class="flex flex-col gap-2 rounded-2xl bg-gray-100 p-5 text-sm text-gray-700 md:flex-row md:items-center md:justify-between"
        >
          <p>掲載内容の修正・削除をご希望の方はこちらからご連絡ください。</p>
          <NuxtLink
            to="/contact"
            class="inline-flex items-center justify-center rounded-full bg-red-500 px-5 py-2 text-white font-semibold shadow hover:bg-red-600 transition"
          >
            掲載内容の修正・削除の依頼はこちら
          </NuxtLink>
        </div>
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
