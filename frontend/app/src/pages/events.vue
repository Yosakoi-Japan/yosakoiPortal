<template>
  <div class="min-h-screen bg-gray-50">
    <Header />

    <main class="bg-white py-12 sm:py-16">
      <section class="mx-auto max-w-5xl px-4 sm:px-6">
        <NuxtLink to="/" class="inline-flex items-center gap-2 text-base font-bold text-red-600 transition hover:text-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500">
          <span aria-hidden="true">←</span>
          トップページへ戻る
        </NuxtLink>

        <div class="mt-6 flex items-start gap-4">
          <svg class="mt-1 h-11 w-11 shrink-0 text-red-500 sm:h-12 sm:w-12" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path stroke-linecap="round" d="M8 3v4m8-4v4M7 11h.01M12 11h.01M17 11h.01M7 16h.01M12 16h.01M17 16h.01" />
          </svg>
          <div>
            <h1 class="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">すべての開催予定</h1>
            <p class="mt-2 text-base text-slate-600 sm:text-lg">これから開催される全国のよさこいイベント</p>
          </div>
        </div>

        <div class="mt-8 space-y-6">
          <div v-if="isLoading" class="rounded-3xl border border-slate-100 bg-slate-50 px-6 py-12 text-center text-slate-600">
            開催予定を読み込み中です…
          </div>

          <template v-else-if="upcomingEvents.length">
            <EventCard
              v-for="event in upcomingEvents"
              :key="event.id"
              :event="event"
              :today="today"
            />
          </template>

          <div v-else class="rounded-3xl border border-slate-200 bg-slate-50 px-6 py-12 text-center text-lg font-medium text-slate-700">
            現在、開催予定のイベントはありません。
          </div>
        </div>
      </section>
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import EventCard from "~/components/atoms/EventCard.vue";
import Footer from "~/components/utils/Footer.vue";
import Header from "~/components/utils/Header.vue";
import { useRemote } from "~/composables/useRemote";
import { SITE_NAME, SITE_URL } from "~/constants/seo";
import { getTokyoDateIso, isUpcomingEvent } from "~/utils/eventDisplay";

const { events, fetchEvents } = useRemote();
const route = useRoute();
const today = ref(getTokyoDateIso());
const isLoading = ref(true);
const upcomingEvents = computed(() =>
  events.value.filter((event) => isUpcomingEvent(event, today.value)),
);

onMounted(async () => {
  today.value = getTokyoDateIso();
  await fetchEvents();
  isLoading.value = false;
});

useHead(() => {
  const url = `${SITE_URL}${route.path}`;
  const pageTitle = "すべてのよさこい開催予定";
  const description = "これから開催される全国のよさこいイベントを開催日順に紹介します。";

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
