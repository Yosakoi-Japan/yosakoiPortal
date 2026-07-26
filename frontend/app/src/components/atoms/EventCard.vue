<template>
  <NuxtLink
    :to="`/event/${event.id}`"
    :aria-label="`${event.title}の詳細を見る`"
    class="group block rounded-3xl bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.09)] ring-1 ring-slate-100 transition duration-200 hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(15,23,42,0.13)] focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 sm:p-7"
  >
    <div class="flex h-full flex-col">
      <span
        class="w-fit rounded-lg bg-gradient-to-r px-3 py-1 text-sm font-bold text-white shadow-sm"
        :class="timingLabelClass"
      >
        {{ timingLabel }}
      </span>

      <div class="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
        <span>{{ dateDisplay.start.value }}</span>
        <span
          class="inline-flex h-9 w-9 items-center justify-center rounded-full text-lg font-bold text-white sm:h-10 sm:w-10 sm:text-xl"
          :class="weekdayClass(dateDisplay.start.weekdayIndex)"
        >
          {{ dateDisplay.start.weekday }}
        </span>
        <template v-if="dateDisplay.end">
          <span class="text-xl font-bold text-slate-500 sm:text-2xl" aria-label="から">〜</span>
          <span>{{ dateDisplay.end.value }}</span>
          <span
            class="inline-flex h-9 w-9 items-center justify-center rounded-full text-lg font-bold text-white sm:h-10 sm:w-10 sm:text-xl"
            :class="weekdayClass(dateDisplay.end.weekdayIndex)"
          >
            {{ dateDisplay.end.weekday }}
          </span>
        </template>
      </div>

      <h3 class="mt-5 text-xl font-bold leading-snug text-slate-950 sm:text-2xl">
        {{ event.title }}
      </h3>

      <p class="mt-3 flex items-start gap-2 text-base font-medium leading-relaxed text-slate-800 sm:text-lg">
        <svg
          class="mt-0.5 h-5 w-5 shrink-0 text-red-500"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z" />
        </svg>
        <span>{{ shortArea }}</span>
      </p>

      <p class="mt-4 line-clamp-2 text-sm leading-7 text-slate-600 sm:text-base">
        {{ event.description }}
      </p>

      <span class="ml-auto mt-5 inline-flex items-center gap-3 rounded-2xl border-2 border-red-500 px-4 py-2.5 text-base font-bold text-red-600 transition group-hover:bg-red-50 sm:px-5 sm:text-lg">
        詳細を見る
        <svg
          class="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="m9 18 6-6-6-6" />
        </svg>
      </span>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { EventListItem } from "~/types/index";
import {
  getEventDateDisplay,
  getEventTimingLabel,
  getShortArea,
  getTokyoDateIso,
} from "~/utils/eventDisplay";

const props = defineProps<{
  event: EventListItem;
  today?: string;
}>();

const effectiveToday = computed(() => props.today ?? getTokyoDateIso());
const dateDisplay = computed(() => getEventDateDisplay(props.event));
const shortArea = computed(() => getShortArea(props.event.area));
const timingLabel = computed(() =>
  getEventTimingLabel(props.event, effectiveToday.value),
);
const timingLabelClass = computed(() => {
  if (timingLabel.value === "来週" || timingLabel.value === "来週末") {
    return "from-orange-500 to-amber-500";
  }
  if (timingLabel.value === "今月") {
    return "from-rose-500 to-orange-500";
  }
  return "from-red-500 to-rose-500";
});

const weekdayClass = (weekday: number) => {
  if (weekday === 6) {
    return "bg-blue-600";
  }
  if (weekday === 0) {
    return "bg-red-500";
  }
  return "bg-slate-600";
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
