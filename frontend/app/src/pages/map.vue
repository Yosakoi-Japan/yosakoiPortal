<script setup lang="ts">
import EventMap from "~/components/map/EventMap.client.vue";
import MapEventCard from "~/components/map/MapEventCard.vue";
import MapPlaceCard from "~/components/map/MapPlaceCard.vue";
import BottomNavigation from "~/components/utils/BottomNavigation.vue";
import Header from "~/components/utils/Header.vue";
import { useRemote } from "~/composables/useRemote";
import { SITE_NAME, SITE_URL } from "~/constants/seo";
import type { EventListItem, MapPlace } from "~/types";
import { getTokyoDateIso, isUpcomingEvent } from "~/utils/eventDisplay";

const { events, fetchEvents } = useRemote();
const route = useRoute();
const router = useRouter();
const isLoading = ref(true);
const selectedEvent = ref<EventListItem>();
const selectedPlace = ref<MapPlace>();
const selectedCard = ref<HTMLElement>();
const today = ref(getTokyoDateIso());

const mappableEvents = computed(() =>
  events.value.filter(
    (event) =>
      isUpcomingEvent(event, today.value) &&
      event.latitude !== undefined &&
      event.longitude !== undefined,
  ),
);

const getSelectedEventIdFromQuery = () => {
  const eventId = route.query.event;
  return typeof eventId === "string" ? eventId : undefined;
};

const restoreSelectedEvent = () => {
  const eventId = getSelectedEventIdFromQuery();
  selectedPlace.value = undefined;
  selectedEvent.value = eventId
    ? mappableEvents.value.find((event) => event.id === eventId)
    : undefined;
};

const replaceSelectedEventQuery = async (eventId?: string) => {
  const query = { ...route.query };

  if (eventId) {
    query.event = eventId;
  } else {
    delete query.event;
  }

  await router.replace({ path: route.path, query });
};

const selectEvent = async (event: EventListItem) => {
  selectedPlace.value = undefined;
  selectedEvent.value = event;
  await replaceSelectedEventQuery(event.id);
  await nextTick();
  selectedCard.value?.focus({ preventScroll: true });
};

const selectPlace = async (place: MapPlace) => {
  selectedEvent.value = undefined;
  selectedPlace.value = place;
  await replaceSelectedEventQuery();
  await nextTick();
  selectedCard.value?.focus({ preventScroll: true });
};

const clearSelection = async () => {
  selectedEvent.value = undefined;
  selectedPlace.value = undefined;
  await replaceSelectedEventQuery();
};

onMounted(async () => {
  today.value = getTokyoDateIso();
  await fetchEvents();
  restoreSelectedEvent();
  isLoading.value = false;
});

watch(() => route.query.event, () => {
  if (isLoading.value) {
    return;
  }

  if (getSelectedEventIdFromQuery()) {
    restoreSelectedEvent();
  } else if (!selectedPlace.value) {
    selectedEvent.value = undefined;
  }
});

useHead(() => {
  const url = `${SITE_URL}${route.path}`;
  const pageTitle = "地図からよさこいを探す";
  const description =
    "地図から全国のよさこいイベントを探せます。開催地を選んで日程や詳細情報を確認できます。";

  return {
    title: pageTitle,
    meta: [
      { name: "description", content: description },
      { property: "og:title", content: `${pageTitle} | ${SITE_NAME}` },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: `${pageTitle} | ${SITE_NAME}` },
      { name: "twitter:description", content: description },
    ],
    link: [{ rel: "canonical", href: url }],
  };
});
</script>

<template>
  <div class="flex h-dvh min-h-[36rem] flex-col overflow-hidden bg-orange-50">
    <div class="shrink-0">
      <Header />
    </div>

    <main
      class="relative mb-[calc(4.5rem+env(safe-area-inset-bottom))] min-h-0 flex-1 md:mb-0"
      aria-label="地図から探す"
    >
      <div
        v-if="isLoading"
        class="flex h-full items-center justify-center px-6"
        role="status"
      >
        <div class="text-center text-slate-700">
          <span class="mx-auto block h-9 w-9 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" aria-hidden="true" />
          <p class="mt-4 font-bold">イベントを読み込んでいます…</p>
        </div>
      </div>

      <div
        v-else-if="!mappableEvents.length"
        class="flex h-full items-center justify-center px-6"
      >
        <div class="max-w-sm rounded-3xl bg-white p-7 text-center shadow-xl ring-1 ring-orange-100">
          <p class="text-xl font-black text-slate-950">地図に表示できるイベントがありません</p>
          <p class="mt-2 text-sm leading-relaxed text-slate-600">
            現在、開催予定と位置情報の両方が登録されたイベントはありません。
          </p>
          <NuxtLink
            to="/events"
            class="mt-5 inline-flex rounded-full border-2 border-orange-500 px-6 py-2.5 font-bold text-orange-600 transition hover:bg-orange-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
          >
            開催予定を見る
          </NuxtLink>
        </div>
      </div>

      <template v-else>
        <EventMap
          :events="mappableEvents"
          :selected-event-id="selectedEvent?.id"
          :has-overlay-card="Boolean(selectedEvent || selectedPlace)"
          @select="selectEvent"
          @select-place="selectPlace"
          @clear-selection="clearSelection"
        />

        <Transition name="card-slide">
          <div
            v-if="selectedEvent || selectedPlace"
            ref="selectedCard"
            tabindex="-1"
            class="absolute inset-x-3 bottom-3 z-20 outline-none md:inset-x-auto md:bottom-6 md:right-6 md:w-96"
          >
            <MapEventCard
              v-if="selectedEvent"
              :event="selectedEvent"
              @close="clearSelection"
            />
            <MapPlaceCard
              v-else-if="selectedPlace"
              :place="selectedPlace"
              @close="clearSelection"
            />
          </div>
        </Transition>
      </template>
    </main>
    <BottomNavigation />
  </div>
</template>

<style scoped>
.card-slide-enter-active,
.card-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.25s ease;
}

.card-slide-enter-from,
.card-slide-leave-to {
  opacity: 0;
  transform: translateY(1rem);
}
</style>
