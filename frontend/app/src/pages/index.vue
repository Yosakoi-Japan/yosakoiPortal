<template>
  <div class="min-h-screen bg-gray-50 pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0">
    <Header />
    <div class="bg-white">
      <TopImage />

      <section class="relative z-10 -mt-6 rounded-t-[2rem] bg-white px-4 pb-2 pt-6 sm:-mt-8 sm:rounded-t-[2.5rem] sm:pb-16 sm:pt-12">
        <div class="mx-auto max-w-6xl">
          <NuxtLink
            to="/guide"
            aria-label="よさこいの楽しみ方を見る"
            class="group block cursor-pointer overflow-hidden rounded-[2rem] border border-rose-100 bg-gradient-to-br from-white via-rose-50/70 to-orange-50/60 shadow-[0_12px_32px_rgba(15,23,42,0.08)] transition duration-200 hover:-translate-y-1 hover:border-rose-200 hover:shadow-[0_16px_36px_rgba(225,29,72,0.14)] focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-4"
          >
            <div class="grid grid-cols-[minmax(8rem,0.72fr)_minmax(0,1.28fr)] items-stretch md:grid-cols-[minmax(15rem,0.8fr)_minmax(0,1.2fr)]">
              <div class="relative bg-rose-50/40">
                <img
                  src="/about_yosakoi.png"
                  alt="鳴子を手に踊るよさこいの踊り手のイラスト"
                  class="absolute inset-0 h-full w-full object-contain p-1 sm:p-4"
                />
              </div>

              <div class="px-4 py-5 sm:px-10 sm:py-10 md:px-8 lg:px-12">
                <h2 class="text-xl font-black tracking-tight text-slate-950 sm:text-3xl">
                  よさこいって何？
                </h2>
                <p class="mt-2 text-sm leading-relaxed text-slate-600 sm:mt-3 sm:text-lg">
                  踊り・音楽・地域の熱気を楽しむお祭りです
                </p>

                <div class="mt-3 flex flex-nowrap gap-1 sm:mt-5 sm:flex-wrap sm:gap-3">
                  <span class="inline-flex shrink-0 items-center whitespace-nowrap rounded-full bg-rose-100 px-1.5 py-1 text-[11px] font-bold text-rose-600 sm:px-4 sm:py-2 sm:text-base">
                    <span class="mr-1 sm:mr-2" aria-hidden="true">🔰</span>初心者向け
                  </span>
                  <span class="inline-flex shrink-0 items-center whitespace-nowrap rounded-full bg-amber-100 px-1.5 py-1 text-[11px] font-bold text-amber-700 sm:px-4 sm:py-2 sm:text-base">
                    <span class="mr-1 sm:mr-2" aria-hidden="true">🌍</span>全国で開催
                  </span>
                </div>

                <span class="mt-4 inline-flex items-center text-sm font-bold text-rose-600 sm:mt-7 sm:text-lg">
                  楽しみ方を見る
                  <svg class="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 sm:ml-3 sm:h-5 sm:w-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m9 18 6-6-6-6" />
                  </svg>
                </span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </section>
    </div>

    <main class="bg-white pb-12 pt-2 sm:py-16">
      <section class="mx-auto max-w-5xl px-4 sm:px-6">
        <div class="flex items-start gap-4">
          <svg class="mt-1 h-11 w-11 shrink-0 text-red-500 sm:h-12 sm:w-12" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path stroke-linecap="round" d="M8 3v4m8-4v4M7 11h.01M12 11h.01M17 11h.01M7 16h.01M12 16h.01M17 16h.01" />
          </svg>
          <div>
            <h1 class="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">近日開催のよさこい</h1>
            <p class="mt-2 text-base text-slate-600 sm:text-lg">近いうちに開催されるイベントをチェック</p>
          </div>
        </div>

        <div class="mt-5 flex gap-3 sm:mt-8" role="tablist" aria-label="開催期間で絞り込む">
          <button
            v-for="tab in eventTabs"
            :key="tab.value"
            type="button"
            role="tab"
            :aria-selected="selectedPeriod === tab.value"
            class="min-w-24 rounded-full border px-5 py-2.5 text-base font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 sm:min-w-32 sm:text-lg"
            :class="selectedPeriod === tab.value ? 'border-red-500 bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-md' : 'border-slate-200 bg-white text-slate-600 hover:border-red-300 hover:text-red-600'"
            @click="setSelectedPeriod(tab.value)"
          >
            {{ tab.label }}
          </button>
        </div>

        <div class="mt-5 space-y-6 sm:mt-8">
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
import BottomNavigation from "~/components/utils/BottomNavigation.vue";
import Footer from "~/components/utils/Footer.vue";
import Header from "~/components/utils/Header.vue";
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
const route = useRoute();
const { selectedPeriod, setSelectedPeriod } = useEventPeriodFilter();
const today = ref(getTokyoDateIso());
const isLoading = ref(true);
const filteredEvents = computed(() =>
  filterEventsByPeriod(events.value, selectedPeriod.value, today.value),
);

onMounted(async () => {
  today.value = getTokyoDateIso();
  await fetchEvents();
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
