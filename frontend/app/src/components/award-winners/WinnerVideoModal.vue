<script setup lang="ts">
import type { AwardWinnerVideo } from "~/types/index";

const props = defineProps<{
  winner: AwardWinnerVideo | null;
}>();

const emit = defineEmits<{
  close: [];
}>();

const modalPanel = ref<HTMLElement | null>(null);
const closeButton = ref<HTMLButtonElement | null>(null);
let previouslyFocused: HTMLElement | null = null;
let previousBodyOverflow = "";

const embedUrl = computed(() =>
  props.winner
    ? `https://www.youtube-nocookie.com/embed/${props.winner.youtubeVideoId}?autoplay=1&rel=0`
    : "",
);

const close = () => emit("close");

const getFocusableElements = () => {
  if (!modalPanel.value) {
    return [];
  }
  return Array.from(
    modalPanel.value.querySelectorAll<HTMLElement>(
      'button:not([disabled]), a[href], iframe, [tabindex]:not([tabindex="-1"])',
    ),
  );
};

const handleKeydown = (event: KeyboardEvent) => {
  if (!props.winner) {
    return;
  }

  if (event.key === "Escape") {
    event.preventDefault();
    close();
    return;
  }

  if (event.key !== "Tab") {
    return;
  }

  const focusableElements = getFocusableElements();
  const first = focusableElements[0];
  const last = focusableElements[focusableElements.length - 1];
  if (!first || !last) {
    event.preventDefault();
    return;
  }

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
};

watch(
  () => props.winner,
  async (winner, previousWinner) => {
    if (winner && !previousWinner) {
      previouslyFocused = document.activeElement as HTMLElement | null;
      previousBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      await nextTick();
      closeButton.value?.focus();
    } else if (!winner && previousWinner) {
      document.body.style.overflow = previousBodyOverflow;
      await nextTick();
      previouslyFocused?.focus();
      previouslyFocused = null;
    }
  },
);

onMounted(() => document.addEventListener("keydown", handleKeydown));

onBeforeUnmount(() => {
  document.removeEventListener("keydown", handleKeydown);
  document.body.style.overflow = previousBodyOverflow;
});
</script>

<template>
  <Teleport to="body">
    <Transition name="winner-modal">
      <div
        v-if="winner"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm sm:p-8"
        @mousedown.self="close"
      >
        <section
          ref="modalPanel"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="`winner-video-title-${winner.youtubeVideoId}`"
          class="relative max-h-full w-full max-w-5xl overflow-y-auto rounded-2xl bg-white shadow-2xl sm:rounded-3xl"
        >
          <button
            ref="closeButton"
            type="button"
            aria-label="動画を閉じる"
            class="absolute right-3 top-3 z-10 grid h-11 w-11 place-items-center rounded-full bg-black/70 text-white shadow-lg transition hover:bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-4 sm:top-4"
            @click="close"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>

          <div class="aspect-video overflow-hidden rounded-t-2xl bg-black sm:rounded-t-3xl">
            <iframe
              :src="embedUrl"
              :title="`${winner.eventName} ${winner.awardName} ${winner.teamName}の演舞動画`"
              class="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen
            />
          </div>

          <div class="p-5 sm:p-7">
            <p class="text-sm font-bold text-red-600">{{ winner.eventName }}</p>
            <h2 :id="`winner-video-title-${winner.youtubeVideoId}`" class="mt-1 text-xl font-black text-slate-950 sm:text-2xl">
              {{ winner.awardName }}｜{{ winner.teamName }}
            </h2>
            <div class="mt-5 flex flex-wrap gap-3 text-sm font-bold">
              <a
                :href="winner.videoUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2.5 text-white transition hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
              >
                YouTubeで見る
                <span aria-hidden="true">↗</span>
              </a>
              <a
                :href="winner.resultSourceUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2.5 text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
              >
                受賞結果の出典
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.winner-modal-enter-active,
.winner-modal-leave-active {
  transition: opacity 180ms ease;
}

.winner-modal-enter-from,
.winner-modal-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .winner-modal-enter-active,
  .winner-modal-leave-active {
    transition: none;
  }
}
</style>
