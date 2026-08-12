<script setup lang="ts">
import type { MapPlace } from "~/types";

const props = defineProps<{
  place: MapPlace;
}>();

defineEmits<{
  close: [];
}>();

const googleMapsUrl = computed(() => {
  const query = encodeURIComponent(
    `${props.place.latitude},${props.place.longitude}`,
  );
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
});
</script>

<template>
  <article
    class="rounded-[1.75rem] border border-orange-100 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.22)] sm:p-6"
    :aria-label="`${place.name}の場所情報`"
  >
    <div class="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-200 md:hidden" aria-hidden="true" />

    <div class="flex items-start justify-between gap-4">
      <div class="min-w-0">
        <p class="text-sm font-bold text-orange-600">選択した施設</p>
        <h2 class="mt-1 text-xl font-black leading-snug text-slate-950 sm:text-2xl">
          {{ place.name }}
        </h2>
      </div>

      <button
        type="button"
        class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-600 transition hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
        :aria-label="`${place.name}のカードを閉じる`"
        @click="$emit('close')"
      >
        <span aria-hidden="true">×</span>
      </button>
    </div>

    <p class="mt-3 text-sm leading-relaxed text-slate-600">
      Google マップでこの場所を確認できます。
    </p>

    <a
      :href="googleMapsUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-orange-500 px-5 py-3 font-bold text-white transition hover:bg-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
    >
      Google マップで開く
      <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M14 5h5v5m0-5-9 9" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" />
      </svg>
    </a>
  </article>
</template>
