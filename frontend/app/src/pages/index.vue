<template>
  <div class="min-h-screen bg-gray-50 pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0">
    <Header />
    <div class="bg-white">
      <div class="relative bg-white pb-12">
        <TopImage />

        <NuxtLink
          to="/guide"
          aria-label="はじめてでも楽しめる よさこいガイド！"
          class="group absolute inset-x-0 bottom-0 z-20 flex items-center border-y border-amber-200 bg-white px-5 py-3 text-slate-950 shadow-[0_10px_26px_rgba(15,23,42,0.12)] transition hover:bg-amber-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-400 sm:px-10 sm:py-5"
        >
          <span class="mr-3 text-xl sm:mr-5 sm:text-3xl" aria-hidden="true">🔰</span>
          <span class="min-w-0 flex-1 text-sm font-bold sm:text-2xl">
            はじめてでも楽しめる&nbsp; よさこいガイド！
          </span>
          <svg class="ml-3 h-5 w-5 shrink-0 transition-transform duration-200 group-hover:translate-x-1 sm:h-6 sm:w-6" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="m9 18 6-6-6-6" />
          </svg>
        </NuxtLink>
      </div>

      <div class="relative z-10 bg-white pb-2 sm:-mt-8 sm:rounded-t-[2.5rem] sm:pb-0 sm:pt-12">
        <WinnerVideoSection
          v-if="awardWinnerVideos.length"
          :videos="awardWinnerVideos"
        />
      </div>
    </div>

    <main class="bg-white pb-12 pt-2 sm:pb-16 sm:pt-8">
      <section class="mx-auto max-w-5xl px-4 sm:px-6">
        <div class="flex items-start gap-3 sm:gap-4">
          <svg class="mt-0.5 h-9 w-9 shrink-0 text-red-500 sm:mt-1 sm:h-12 sm:w-12" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path stroke-linecap="round" d="M8 3v4m8-4v4M7 11h.01M12 11h.01M17 11h.01M7 16h.01M12 16h.01M17 16h.01" />
          </svg>
          <div>
            <h1 class="text-xl font-black tracking-tight text-slate-950 sm:text-3xl">近日開催のよさこい</h1>
            <p class="mt-1 text-sm text-slate-600 sm:mt-2 sm:text-lg">近いうちに開催されるイベントをチェック</p>
          </div>
        </div>

        <div class="mt-3 flex gap-2 sm:mt-8 sm:gap-3" role="tablist" aria-label="開催期間で絞り込む">
          <button
            v-for="tab in eventTabs"
            :key="tab.value"
            type="button"
            role="tab"
            :aria-selected="selectedPeriod === tab.value"
            class="min-w-20 rounded-full border px-4 py-2 text-sm font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 sm:min-w-32 sm:px-5 sm:py-2.5 sm:text-lg"
            :class="selectedPeriod === tab.value ? 'border-red-500 bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-md' : 'border-slate-200 bg-white text-slate-600 hover:border-red-300 hover:text-red-600'"
            @click="setSelectedPeriod(tab.value)"
          >
            {{ tab.label }}
          </button>
        </div>

        <div class="mt-4 space-y-6 sm:mt-8">
          <div v-if="isLoading" class="rounded-3xl border border-slate-100 bg-slate-50 px-6 py-12 text-center text-slate-600">
            開催予定を読み込み中です…
          </div>

          <template v-else-if="filteredEvents.length">
            <EventCard
              v-for="event in filteredEvents"
              :key="event.id"
              :event="event"
              :today="today"
            />
          </template>

          <div v-else class="rounded-3xl border border-slate-200 bg-slate-50 px-6 py-12 text-center">
            <p class="text-base font-medium text-slate-700 sm:text-lg">この期間に開催予定のイベントはありません。</p>
            <NuxtLink to="/events" class="mt-5 inline-flex items-center gap-2 font-bold text-red-600 underline underline-offset-4 hover:text-red-700">
              すべての開催予定を見る
              <span aria-hidden="true">→</span>
            </NuxtLink>
          </div>
        </div>

        <NuxtLink
          to="/events"
          class="mt-8 flex items-center justify-center gap-3 rounded-2xl border-2 border-red-500 px-5 py-3.5 text-lg font-bold text-red-600 transition hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 sm:text-xl"
        >
          すべての開催予定を見る
          <svg class="h-7 w-7" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="m9 18 6-6-6-6" />
          </svg>
        </NuxtLink>
      </section>
    </main>

    <Footer />
    <BottomNavigation />
  </div>
</template>

<script setup lang="ts">
import EventCard from "~/components/atoms/EventCard.vue";
import TopImage from "~/components/atoms/TopImage.vue";
import WinnerVideoSection from "~/components/award-winners/WinnerVideoSection.vue";
import BottomNavigation from "~/components/utils/BottomNavigation.vue";
import Footer from "~/components/utils/Footer.vue";
import Header from "~/components/utils/Header.vue";
import { useAwardWinners } from "~/composables/useAwardWinners";
import { useEventPeriodFilter } from "~/composables/useEventPeriodFilter";
import { useRemote } from "~/composables/useRemote";
import { SITE_NAME, SITE_URL } from "~/constants/seo";
import {
  filterEventsByPeriod,
  getTokyoDateIso,
} from "~/utils/eventDisplay";

const eventTabs = [
  { label: "今月", value: "this-month" },
  { label: "来月", value: "next-month" },
] as const;

const { events, fetchEvents } = useRemote();
const { awardWinnerVideos, fetchAwardWinnerVideos } = useAwardWinners();
const route = useRoute();
const { selectedPeriod, setSelectedPeriod } = useEventPeriodFilter();
const today = ref(getTokyoDateIso());
const isLoading = ref(true);
const filteredEvents = computed(() =>
  filterEventsByPeriod(events.value, selectedPeriod.value, today.value),
);

onMounted(async () => {
  today.value = getTokyoDateIso();
  await Promise.all([fetchEvents(), fetchAwardWinnerVideos()]);
  isLoading.value = false;
});

useHead(() => {
  const url = `${SITE_URL}${route.path}`;
  const pageTitle = "全国のよさこい祭り情報";
  const description = "日本各地で開催される直近のよさこいイベントを、開催日程や会場情報とともに紹介します。";

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
