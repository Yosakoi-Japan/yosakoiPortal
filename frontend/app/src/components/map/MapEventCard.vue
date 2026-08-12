<script setup lang="ts">
import type { EventListItem } from "~/types";
import { getEventDateDisplay, getShortArea } from "~/utils/eventDisplay";

const props = defineProps<{
  event: EventListItem;
}>();

defineEmits<{
  close: [];
}>();

const dateDisplay = computed(() => getEventDateDisplay(props.event));

const googleMapsUrl = computed(() => {
  if (
    props.event.latitude === undefined ||
    props.event.longitude === undefined
  ) {
    return undefined;
  }

  const query = encodeURIComponent(
    `${props.event.latitude},${props.event.longitude}`,
  );
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
});
</script>

<template>
  <article
    class="rounded-[1.75rem] border border-orange-100 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.22)] sm:p-6"
    :aria-label="`${event.title}の概要`"
  >
    <div class="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-200 md:hidden" aria-hidden="true" />

    <div class="flex items-start justify-between gap-4">
      <div class="min-w-0">
        <p class="font-bold text-orange-600">
          {{ dateDisplay.start.value }}（{{ dateDisplay.start.weekday }}）
          <template v-if="dateDisplay.end">
            〜 {{ dateDisplay.end.value }}（{{ dateDisplay.end.weekday }}）
          </template>
        </p>
        <h2 class="mt-1 text-xl font-black leading-snug text-slate-950 sm:text-2xl">
          {{ event.title }}
        </h2>
      </div>

      <button
        type="button"
        class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-600 transition hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
        :aria-label="`${event.title}のカードを閉じる`"
        @click="$emit('close')"
      >
        <span aria-hidden="true">×</span>
      </button>
    </div>

    <p class="mt-3 flex items-start gap-2 text-sm leading-relaxed text-slate-600">
      <svg class="mt-0.5 h-5 w-5 shrink-0 text-orange-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 21s7-5.2 7-12a7 7 0 1 0-14 0c0 6.8 7 12 7 12Z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
      <span>{{ getShortArea(event.area) }}</span>
    </p>

    <div class="mt-5 grid grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-3">
      <NuxtLink
        :to="`/event/${event.id}`"
        class="inline-flex min-h-12 items-center justify-center gap-1.5 whitespace-nowrap rounded-full border-2 border-orange-500 px-2 py-2.5 text-xs font-bold text-orange-600 transition hover:bg-orange-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 sm:gap-2 sm:px-3 sm:text-sm"
      >
        詳細を見る
        <span aria-hidden="true">→</span>
      </NuxtLink>

      <a
        v-if="googleMapsUrl"
        :href="googleMapsUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex min-h-12 items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-orange-500 px-2 py-2.5 text-[11px] font-bold text-white transition hover:bg-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 sm:gap-2 sm:px-3 sm:text-sm"
      >
        Google マップで開く
        <svg class="h-4 w-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M14 5h5v5m0-5-9 9" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" />
        </svg>
      </a>
    </div>
  </article>
</template>
