<script setup lang="ts">
import WinnerVideoCard from "~/components/award-winners/WinnerVideoCard.vue";
import WinnerVideoModal from "~/components/award-winners/WinnerVideoModal.vue";
import type { AwardWinnerVideo } from "~/types/index";

const props = defineProps<{
  videos: AwardWinnerVideo[];
}>();

const isExpanded = ref(false);
const activeIndex = ref(0);
const carousel = ref<HTMLElement | null>(null);
const selectedWinner = ref<AwardWinnerVideo | null>(null);
let scrollFrame: number | undefined;

const initialSecondaryVideos = computed(() => props.videos.slice(1, 4));
const additionalVideos = computed(() => props.videos.slice(4));

const selectWinner = (winner: AwardWinnerVideo) => {
  selectedWinner.value = winner;
};

const updateActiveIndex = () => {
  if (!carousel.value) {
    return;
  }

  const cards = Array.from(carousel.value.children) as HTMLElement[];
  const scrollLeft = carousel.value.scrollLeft;
  let closestIndex = 0;
  let closestDistance = Number.POSITIVE_INFINITY;

  cards.forEach((card, index) => {
    const distance = Math.abs(card.offsetLeft - scrollLeft);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  });
  activeIndex.value = closestIndex;
};

const handleCarouselScroll = () => {
  if (scrollFrame !== undefined) {
    cancelAnimationFrame(scrollFrame);
  }
  scrollFrame = requestAnimationFrame(updateActiveIndex);
};

const scrollToVideo = (index: number) => {
  const card = carousel.value?.children[index] as HTMLElement | undefined;
  if (!carousel.value || !card) {
    return;
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  carousel.value.scrollTo({
    left: card.offsetLeft,
    behavior: reduceMotion ? "auto" : "smooth",
  });
};

watch(
  () => props.videos,
  (videos) => {
    activeIndex.value = Math.min(activeIndex.value, Math.max(videos.length - 1, 0));
    if (
      selectedWinner.value &&
      !videos.some((video) => video.id === selectedWinner.value?.id)
    ) {
      selectedWinner.value = null;
    }
    if (videos.length <= 4) {
      isExpanded.value = false;
    }
  },
);

onBeforeUnmount(() => {
  if (scrollFrame !== undefined) {
    cancelAnimationFrame(scrollFrame);
  }
});
</script>

<template>
  <section v-if="videos.length" aria-labelledby="winner-videos-heading" class="px-4 pb-5 sm:px-6 sm:pb-4">
    <div class="mx-auto max-w-6xl rounded-3xl border border-amber-200/80 bg-gradient-to-br from-amber-50 via-orange-50/80 to-white p-4 shadow-[0_14px_40px_rgba(120,53,15,0.10)] sm:p-7 lg:p-8">
      <div class="flex items-center justify-between gap-4">
        <div class="flex min-w-0 items-center gap-3">
          <span class="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-red-500 to-orange-500 text-white shadow-md" aria-hidden="true">
            <svg class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="m5 4 2.3 4.7L12 4l4.7 4.7L19 4l-1 10H6L5 4Zm1.3 12h11.4v3H6.3v-3Z" />
            </svg>
          </span>
          <div class="min-w-0">
            <h2 id="winner-videos-heading" class="text-xl font-black tracking-tight text-slate-950 sm:text-2xl lg:text-3xl">
              優勝チームの演舞を観る
            </h2>
            <p class="mt-1 text-xs font-medium text-slate-600 sm:text-sm">最新の受賞演舞を期間限定で掲載</p>
            <p class="mt-1 text-[10px] leading-tight text-slate-400 sm:text-xs">
              ※ 掲載情報に誤りがある可能性があります
            </p>
          </div>
        </div>

        <button
          v-if="videos.length > 4"
          type="button"
          class="hidden shrink-0 items-center gap-2 rounded-full border border-amber-300 bg-white px-4 py-2 text-sm font-bold text-slate-800 transition hover:border-amber-400 hover:bg-amber-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 md:inline-flex"
          :aria-expanded="isExpanded"
          aria-controls="additional-winner-videos"
          @click="isExpanded = !isExpanded"
        >
          {{ isExpanded ? "閉じる" : "すべて見る" }}
          <svg class="h-4 w-4 transition-transform" :class="{ 'rotate-180': isExpanded }" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </div>

      <div class="mt-5 hidden gap-4 md:grid" :class="videos.length > 1 ? 'grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)]' : 'grid-cols-1'">
        <WinnerVideoCard :winner="videos[0]" featured @select="selectWinner" />
        <div v-if="initialSecondaryVideos.length" class="grid content-start gap-3">
          <WinnerVideoCard
            v-for="winner in initialSecondaryVideos"
            :key="winner.id"
            :winner="winner"
            @select="selectWinner"
          />
        </div>
      </div>

      <div
        v-if="isExpanded && additionalVideos.length"
        id="additional-winner-videos"
        class="mt-4 hidden grid-cols-2 gap-4 md:grid xl:grid-cols-3"
      >
        <WinnerVideoCard
          v-for="winner in additionalVideos"
          :key="winner.id"
          :winner="winner"
          @select="selectWinner"
        />
      </div>

      <div class="mt-5 md:hidden">
        <div
          ref="carousel"
          class="winner-carousel -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2"
          role="region"
          aria-roledescription="carousel"
          aria-label="優勝チームの演舞動画"
          @scroll.passive="handleCarouselScroll"
        >
          <div
            v-for="winner in videos"
            :key="winner.id"
            class="w-[86%] shrink-0 snap-start first:ml-0"
          >
            <WinnerVideoCard :winner="winner" featured @select="selectWinner" />
          </div>
        </div>

        <div v-if="videos.length > 1" class="mt-4 flex justify-center gap-2" aria-label="動画を選択">
          <button
            v-for="(winner, index) in videos"
            :key="winner.id"
            type="button"
            class="h-2.5 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
            :class="activeIndex === index ? 'w-7 bg-red-500' : 'w-2.5 bg-slate-300'"
            :aria-label="`${index + 1}件目を表示`"
            :aria-current="activeIndex === index ? 'true' : undefined"
            @click="scrollToVideo(index)"
          />
        </div>
      </div>
    </div>

    <WinnerVideoModal :winner="selectedWinner" @close="selectedWinner = null" />
  </section>
</template>

<style scoped>
.winner-carousel {
  scrollbar-width: none;
}

.winner-carousel::-webkit-scrollbar {
  display: none;
}
</style>
