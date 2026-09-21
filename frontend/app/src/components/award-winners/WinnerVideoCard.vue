<script setup lang="ts">
import type { AwardWinnerVideo } from "~/types/index";
import { getYoutubeThumbnailUrl } from "~/utils/youtube";

const props = withDefaults(
  defineProps<{
    winner: AwardWinnerVideo;
    featured?: boolean;
  }>(),
  { featured: false },
);

defineEmits<{
  select: [winner: AwardWinnerVideo];
}>();

const thumbnailUrl = computed(() =>
  getYoutubeThumbnailUrl(props.winner.youtubeVideoId),
);
</script>

<template>
  <button
    type="button"
    class="group w-full overflow-hidden rounded-2xl border border-amber-200/80 bg-white text-left shadow-[0_8px_24px_rgba(120,53,15,0.10)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(120,53,15,0.16)] focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
    :aria-label="`${winner.eventName} ${winner.awardName}、${winner.teamName}の演舞動画を再生`"
    @click="$emit('select', winner)"
  >
    <template v-if="featured">
      <div class="relative aspect-video overflow-hidden bg-slate-900">
        <img
          :src="thumbnailUrl"
          alt=""
          class="h-full w-full object-cover transition duration-300 group-hover:scale-[1.025]"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/15" />

        <span class="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-amber-300 px-3 py-1.5 text-xs font-black text-amber-950 shadow sm:text-sm">
          <span aria-hidden="true">🏆</span>
          {{ winner.awardName }}
        </span>

        <span class="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-red-600 shadow-xl transition group-hover:scale-110" aria-hidden="true">
          <svg class="ml-1 h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>

        <div class="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
          <p class="text-xs font-bold text-amber-200 sm:text-sm">{{ winner.eventName }}</p>
          <p class="mt-1 text-xl font-black leading-tight sm:text-2xl">{{ winner.teamName }}</p>
        </div>
      </div>

    </template>

    <template v-else>
      <div class="grid min-h-28 grid-cols-[minmax(8rem,0.9fr)_minmax(0,1.1fr)] items-stretch">
        <div class="relative overflow-hidden bg-slate-900">
          <img
            :src="thumbnailUrl"
            alt=""
            class="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-black/15" />
          <span class="absolute left-2 top-2 rounded-full bg-amber-300 px-2 py-1 text-[10px] font-black text-amber-950 shadow">
            {{ winner.awardName }}
          </span>
          <span class="absolute left-1/2 top-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-red-600 shadow" aria-hidden="true">
            <svg class="ml-0.5 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </div>
        <div class="flex min-w-0 flex-col justify-center px-4 py-3">
          <p class="line-clamp-2 text-xs font-bold text-slate-500">{{ winner.eventName }}</p>
          <p class="mt-1 line-clamp-2 text-base font-black leading-snug text-slate-950">{{ winner.teamName }}</p>
          <span class="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-red-600">
            動画を再生
            <svg class="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="m9 18 6-6-6-6" />
            </svg>
          </span>
        </div>
      </div>
    </template>
  </button>
</template>
