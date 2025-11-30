<template>
  <div class="min-h-screen bg-gray-50">
    <Header />
    <!-- トップ画像 -->
    <TopImage />

    <!-- よさこいの楽しみ方紹介 -->
    <section class="bg-gradient-to-br from-red-50 to-pink-50 py-16">
      <div class="container mx-auto px-4">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-12">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-800 mb-12">
              <span class="text-red-500">🎌</span> よさこいって何？
            </h2>
            <p class="text-lg md:text-xl text-gray-600 mb-8">
              初めての方でも安心！よさこい祭りの魅力と楽しみ方をご紹介
            </p>
          </div>

          <div class="text-center">
            <div
              class="inline-flex items-center bg-white rounded-full shadow-lg px-6 py-4 mb-6"
            >
              <span class="text-2xl mr-3">✨</span>
              <span class="text-gray-700 font-medium"
                >初心者の方も大歓迎！気軽に楽しめます</span
              >
            </div>
            <div>
              <NuxtLink
                to="/guide"
                class="inline-flex items-center bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <span class="mr-2">📖</span>
                詳しい楽しみ方を見る
                <svg
                  class="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- メイン -->
    <main class="container mx-auto px-4 py-10">
      <section>
        <h2 class="text-xl font-bold mb-4">よさこい祭り一覧</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <EventCard
            v-for="event in events"
            :key="event.id"
            :title="event.title"
            :area="event.area"
            :description="event.description"
            :period="event.period"
            @click="handleEventClick"
          />
        </div>
      </section>
    </main>

    <!-- フッター -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Header from "~/components/utils/Header.vue";
import Footer from "~/components/utils/Footer.vue";
import EventCard from "~/components/atoms/EventCard.vue";
import TopImage from "~/components/atoms/TopImage.vue";
import { useRemote } from "~/composables/useRemote";
import { SITE_NAME, SITE_URL, DEFAULT_DESCRIPTION } from "~/constants/seo";

const { events, fetchEvents } = useRemote();
const route = useRoute();

const handleEventClick = (event: {
  title: string;
  area: string;
  description: string;
  period?: string;
}) => {
  // イベント一覧から該当するイベントを検索してIDを取得
  const eventData = events.value.find((e) => e.title === event.title);
  const eventId = eventData?.id || "unknown";

  navigateTo(`/event/${eventId}`);
};

onMounted(() => {
  fetchEvents();
});

useHead(() => {
  const url = `${SITE_URL}${route.path}`;
  const pageTitle = "全国のよさこい祭り情報";
  const description =
    "日本各地で開催される最新のよさこい祭りを一覧でチェック。開催日程や会場情報を探せます。";

  return {
    title: pageTitle,
    meta: [
      { name: "description", content: description },
      { property: "og:title", content: `${pageTitle} | ${SITE_NAME}` },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: `${pageTitle} | ${SITE_NAME}` },
      { name: "twitter:description", content: description },
    ],
    link: [{ rel: "canonical", href: url }],
  };
});
</script>
