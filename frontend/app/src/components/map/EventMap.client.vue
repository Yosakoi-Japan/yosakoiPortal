<script setup lang="ts">
import type { FeatureCollection, Point } from "geojson";
import type {
  GeoJSONSource,
  Map as MapLibreMap,
  MapLayerMouseEvent,
  MapMouseEvent,
  Marker as MapLibreMarker,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import mapLibreWorkerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import type { EventListItem, MapPlace } from "~/types";

type EventFeatureProperties = {
  id: string;
  title: string;
};

const props = defineProps<{
  events: EventListItem[];
  selectedEventId?: string;
  hasOverlayCard?: boolean;
}>();

const emit = defineEmits<{
  select: [event: EventListItem];
  selectPlace: [place: MapPlace];
  clearSelection: [];
}>();

const MAP_STYLE_URL = "https://tiles.openfreemap.org/styles/liberty";
const MAP_CENTER: [number, number] = [139.6917, 35.6895];
const SOURCE_ID = "yosakoi-events";
const CLUSTER_LAYER_ID = "event-clusters";
const CLUSTER_COUNT_LAYER_ID = "event-cluster-count";
const EVENT_LAYER_ID = "event-points";
const SELECTED_LAYER_ID = "selected-event";
const DETAIL_MARKER_MIN_ZOOM = 9;
const SELECTED_EVENT_ZOOM = 12;

const mapContainer = ref<HTMLDivElement>();
const isMapLoading = ref(true);
const mapError = ref(false);
let map: MapLibreMap | undefined;
let isMapReady = false;
let MarkerConstructor: typeof import("maplibre-gl").Marker | undefined;
const eventMarkers = new Map<string, MapLibreMarker>();

const formatMarkerDate = (event: EventListItem) => {
  const [startYear, startMonth, startDay] = event.startDate
    .split("-")
    .map(Number);
  const [endYear, endMonth, endDay] = event.endDate.split("-").map(Number);

  if (event.startDate === event.endDate) {
    return `${startMonth}/${startDay}`;
  }

  if (startYear === endYear && startMonth === endMonth) {
    return `${startMonth}/${startDay}・${endDay}`;
  }

  return `${startMonth}/${startDay}〜${endMonth}/${endDay}`;
};

const updateEventMarkerVisibility = () => {
  if (!map) {
    return;
  }

  const display = map.getZoom() >= DETAIL_MARKER_MIN_ZOOM ? "flex" : "none";
  for (const marker of eventMarkers.values()) {
    marker.getElement().style.display = display;
  }
};

const updateEventMarkerSelection = () => {
  for (const [eventId, marker] of eventMarkers) {
    marker
      .getElement()
      .classList.toggle("is-selected", eventId === props.selectedEventId);
  }
};

const clearEventMarkers = () => {
  for (const marker of eventMarkers.values()) {
    marker.remove();
  }
  eventMarkers.clear();
};

const createEventMarkers = () => {
  clearEventMarkers();
  if (!map || !MarkerConstructor) {
    return;
  }

  for (const event of props.events) {
    if (event.latitude === undefined || event.longitude === undefined) {
      continue;
    }

    const markerButton = document.createElement("button");
    markerButton.type = "button";
    markerButton.className = "map-event-marker";
    markerButton.setAttribute("aria-label", `${event.title}を選択`);

    const dateLabel = document.createElement("span");
    dateLabel.className = "map-event-marker-date";
    dateLabel.textContent = formatMarkerDate(event);

    const titleLabel = document.createElement("span");
    titleLabel.className = "map-event-marker-title";
    titleLabel.textContent = event.title;

    const markerContent = document.createElement("span");
    markerContent.className = "map-event-marker-content";
    markerContent.append(dateLabel, titleLabel);
    markerButton.append(markerContent);
    markerButton.addEventListener("click", (clickEvent) => {
      clickEvent.stopPropagation();
      emit("select", event);
      map?.easeTo({
        center: [event.longitude!, event.latitude!],
        zoom: Math.max(map.getZoom(), 12),
        padding: { bottom: 180 },
        duration: 500,
      });
    });

    const marker = new MarkerConstructor({
      element: markerButton,
      anchor: "bottom",
      offset: [0, -8],
    })
      .setLngLat([event.longitude, event.latitude])
      .addTo(map);

    eventMarkers.set(event.id, marker);
  }

  updateEventMarkerSelection();
  updateEventMarkerVisibility();
};

const eventGeoJson = computed<FeatureCollection<Point, EventFeatureProperties>>(
  () => ({
    type: "FeatureCollection",
    features: props.events.flatMap((event) => {
      if (event.latitude === undefined || event.longitude === undefined) {
        return [];
      }

      return [
        {
          type: "Feature" as const,
          id: event.id,
          geometry: {
            type: "Point" as const,
            coordinates: [event.longitude, event.latitude],
          },
          properties: {
            id: event.id,
            title: event.title,
          },
        },
      ];
    }),
  }),
);

const updateSelectedFilter = () => {
  if (!map?.getLayer(SELECTED_LAYER_ID)) {
    return;
  }

  map.setFilter(SELECTED_LAYER_ID, [
    "==",
    ["get", "id"],
    props.selectedEventId ?? "",
  ]);
};

const getFeatureCoordinates = (event: MapLayerMouseEvent) => {
  const geometry = event.features?.[0]?.geometry;
  if (geometry?.type !== "Point") {
    return undefined;
  }
  return geometry.coordinates as [number, number];
};

const handleClusterClick = async (event: MapLayerMouseEvent) => {
  const feature = event.features?.[0];
  const coordinates = getFeatureCoordinates(event);
  const clusterId = feature?.properties?.cluster_id;
  const source = map?.getSource(SOURCE_ID) as GeoJSONSource | undefined;

  if (!map || !coordinates || typeof clusterId !== "number" || !source) {
    return;
  }

  const zoom = await source.getClusterExpansionZoom(clusterId);
  map.easeTo({ center: coordinates, zoom });
};

const handleEventClick = (event: MapLayerMouseEvent) => {
  const eventId = event.features?.[0]?.properties?.id;
  const coordinates = getFeatureCoordinates(event);
  const selectedEvent = props.events.find((item) => item.id === eventId);

  if (!map || !selectedEvent || !coordinates) {
    return;
  }

  emit("select", selectedEvent);
  map.easeTo({
    center: coordinates,
    zoom: Math.max(map.getZoom(), 9),
    padding: { bottom: 180 },
    duration: 650,
  });
};

const handleMapClick = (event: MapMouseEvent) => {
  if (!map) {
    return;
  }

  const interactiveFeatures = map.queryRenderedFeatures(event.point, {
    layers: [
      CLUSTER_LAYER_ID,
      CLUSTER_COUNT_LAYER_ID,
      EVENT_LAYER_ID,
      SELECTED_LAYER_ID,
    ],
  });
  if (interactiveFeatures.length) {
    return;
  }

  const placeFeature = map
    .queryRenderedFeatures(event.point)
    .find(
      (feature) =>
        feature.sourceLayer === "poi" && feature.geometry.type === "Point",
    );
  const placeName = String(
    placeFeature?.properties?.["name:ja"] ??
      placeFeature?.properties?.name ??
      "",
  ).trim();

  if (!placeFeature || placeFeature.geometry.type !== "Point" || !placeName) {
    emit("clearSelection");
    return;
  }

  const [longitude, latitude] = placeFeature.geometry.coordinates as [
    number,
    number,
  ];
  emit("selectPlace", { name: placeName, latitude, longitude });
};

const setPointerCursor = () => {
  if (map) {
    map.getCanvas().style.cursor = "pointer";
  }
};

const clearPointerCursor = () => {
  if (map) {
    map.getCanvas().style.cursor = "";
  }
};

const addEventLayers = () => {
  if (!map) {
    return;
  }

  map.addSource(SOURCE_ID, {
    type: "geojson",
    data: eventGeoJson.value,
    cluster: true,
    clusterMaxZoom: DETAIL_MARKER_MIN_ZOOM - 1,
    clusterRadius: 48,
  });

  map.addLayer({
    id: CLUSTER_LAYER_ID,
    type: "circle",
    source: SOURCE_ID,
    filter: ["has", "point_count"],
    paint: {
      "circle-color": "#f97316",
      "circle-radius": [
        "step",
        ["get", "point_count"],
        20,
        5,
        24,
        10,
        29,
      ],
      "circle-stroke-color": "#ffffff",
      "circle-stroke-width": 3,
      "circle-opacity": 0.96,
    },
  });

  map.addLayer({
    id: CLUSTER_COUNT_LAYER_ID,
    type: "symbol",
    source: SOURCE_ID,
    filter: ["has", "point_count"],
    layout: {
      "text-field": ["get", "point_count_abbreviated"],
      "text-font": ["Noto Sans Regular"],
      "text-size": 14,
    },
    paint: {
      "text-color": "#ffffff",
    },
  });

  map.addLayer({
    id: SELECTED_LAYER_ID,
    type: "circle",
    source: SOURCE_ID,
    maxzoom: DETAIL_MARKER_MIN_ZOOM,
    filter: ["==", ["get", "id"], props.selectedEventId ?? ""],
    paint: {
      "circle-color": "#fb923c",
      "circle-radius": 17,
      "circle-stroke-color": "#fed7aa",
      "circle-stroke-width": 7,
      "circle-opacity": 0.5,
    },
  });

  map.addLayer({
    id: EVENT_LAYER_ID,
    type: "circle",
    source: SOURCE_ID,
    maxzoom: DETAIL_MARKER_MIN_ZOOM,
    filter: ["!", ["has", "point_count"]],
    paint: {
      "circle-color": "#f97316",
      "circle-radius": 10,
      "circle-stroke-color": "#ffffff",
      "circle-stroke-width": 4,
    },
  });

  map.on("click", CLUSTER_LAYER_ID, handleClusterClick);
  map.on("click", EVENT_LAYER_ID, handleEventClick);
  map.on("mouseenter", CLUSTER_LAYER_ID, setPointerCursor);
  map.on("mouseleave", CLUSTER_LAYER_ID, clearPointerCursor);
  map.on("mouseenter", EVENT_LAYER_ID, setPointerCursor);
  map.on("mouseleave", EVENT_LAYER_ID, clearPointerCursor);
  map.on("click", handleMapClick);
  map.on("zoom", updateEventMarkerVisibility);

  createEventMarkers();
};

const destroyMap = () => {
  isMapReady = false;
  clearEventMarkers();
  map?.remove();
  map = undefined;
};

const initializeMap = async () => {
  destroyMap();
  isMapLoading.value = true;
  mapError.value = false;

  try {
    const { Map, GeolocateControl, Marker, setWorkerUrl } = await import(
      "maplibre-gl"
    );
    setWorkerUrl(mapLibreWorkerUrl);
    MarkerConstructor = Marker;

    if (!mapContainer.value) {
      return;
    }

    const initialSelectedEvent = props.events.find(
      (event) =>
        event.id === props.selectedEventId &&
        event.latitude !== undefined &&
        event.longitude !== undefined,
    );
    const initialCenter: [number, number] = initialSelectedEvent
      ? [initialSelectedEvent.longitude!, initialSelectedEvent.latitude!]
      : MAP_CENTER;

    map = new Map({
      container: mapContainer.value,
      style: MAP_STYLE_URL,
      center: initialCenter,
      zoom: initialSelectedEvent ? SELECTED_EVENT_ZOOM : 7,
      padding: initialSelectedEvent ? { bottom: 180 } : undefined,
      minZoom: 3.5,
      maxZoom: 17,
      attributionControl: true,
      locale: {
        "AttributionControl.ToggleAttribution": "地図の帰属情報を表示",
        "GeolocateControl.FindMyLocation": "現在地を表示",
        "GeolocateControl.LocationNotAvailable": "現在地を取得できません",
        "Map.Title": "よさこいイベント地図",
      },
    });

    map.addControl(
      new GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: false,
        showUserLocation: true,
      }),
      "bottom-right",
    );

    map.on("load", () => {
      if (!map) {
        return;
      }
      addEventLayers();
      isMapReady = true;
      isMapLoading.value = false;
    });

    map.on("error", () => {
      if (!isMapReady) {
        isMapLoading.value = false;
        mapError.value = true;
      }
    });
  } catch (error) {
    console.error("Failed to initialize event map:", error);
    isMapLoading.value = false;
    mapError.value = true;
  }
};

watch(eventGeoJson, (geoJson) => {
  if (!isMapReady) {
    return;
  }
  const source = map?.getSource(SOURCE_ID) as GeoJSONSource | undefined;
  source?.setData(geoJson);
  createEventMarkers();
});

watch(() => props.selectedEventId, () => {
  updateSelectedFilter();
  updateEventMarkerSelection();
});

onMounted(initializeMap);
onBeforeUnmount(destroyMap);
</script>

<template>
  <div
    class="relative h-full w-full bg-orange-50"
    :class="{ 'has-overlay-card': hasOverlayCard }"
  >
    <div ref="mapContainer" class="h-full w-full" />

    <div
      v-if="isMapLoading"
      class="absolute inset-0 z-10 flex items-center justify-center bg-orange-50/95"
      role="status"
    >
      <div class="text-center text-slate-700">
        <span
          class="mx-auto block h-9 w-9 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500"
          aria-hidden="true"
        />
        <p class="mt-4 font-bold">地図を読み込んでいます…</p>
      </div>
    </div>

    <div
      v-else-if="mapError"
      class="absolute inset-0 z-10 flex items-center justify-center bg-orange-50 px-6"
      role="alert"
    >
      <div class="max-w-sm rounded-3xl bg-white p-7 text-center shadow-xl ring-1 ring-orange-100">
        <p class="text-lg font-black text-slate-950">地図を読み込めませんでした</p>
        <p class="mt-2 text-sm leading-relaxed text-slate-600">
          通信状況を確認して、もう一度お試しください。
        </p>
        <button
          type="button"
          class="mt-5 rounded-full bg-orange-500 px-6 py-2.5 font-bold text-white transition hover:bg-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
          @click="initializeMap"
        >
          再読み込み
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.maplibregl-ctrl-bottom-right) {
  right: 0.75rem;
  bottom: 0.75rem;
  transition: bottom 0.25s ease;
}

.has-overlay-card :deep(.maplibregl-ctrl-bottom-right) {
  bottom: 15.5rem;
}

:deep(.maplibregl-ctrl-group) {
  overflow: hidden;
  border-radius: 0.85rem;
  box-shadow: 0 6px 18px rgb(15 23 42 / 14%);
}

:deep(.maplibregl-ctrl-group .maplibregl-ctrl-geolocate) {
  width: 3.25rem;
  height: 3.25rem;
}

:deep(.maplibregl-ctrl-geolocate .maplibregl-ctrl-icon) {
  width: 100%;
  height: 100%;
  background-size: 1.65rem 1.65rem;
}

:deep(.maplibregl-ctrl-attrib) {
  font-size: 10px;
}

:deep(.map-event-marker) {
  display: none;
  min-width: 5.5rem;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  filter: drop-shadow(0 4px 5px rgb(15 23 42 / 20%));
}

:deep(.map-event-marker:hover),
:deep(.map-event-marker:focus-visible) {
  z-index: 2;
  outline: none;
}

:deep(.map-event-marker-content) {
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.18s ease;
}

:deep(.map-event-marker:hover .map-event-marker-content),
:deep(.map-event-marker:focus-visible .map-event-marker-content) {
  transform: translateY(-2px) scale(1.04);
}

:deep(.map-event-marker-date) {
  position: relative;
  z-index: 1;
  display: block;
  border: 3px solid #ffffff;
  border-radius: 9999px;
  background: linear-gradient(135deg, #ff7a00, #f04400);
  padding: 0.38rem 0.78rem;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 900;
  line-height: 1;
  white-space: nowrap;
}

:deep(.map-event-marker-date::after) {
  position: absolute;
  bottom: -0.42rem;
  left: 50%;
  width: 0;
  height: 0;
  border-top: 0.52rem solid #f4510b;
  border-right: 0.42rem solid transparent;
  border-left: 0.42rem solid transparent;
  content: "";
  transform: translateX(-50%);
}

:deep(.map-event-marker-title) {
  display: block;
  max-width: 10rem;
  margin-top: 0.28rem;
  overflow: hidden;
  border: 1px solid rgb(226 232 240);
  border-radius: 0.5rem;
  background: rgb(255 255 255 / 96%);
  padding: 0.28rem 0.52rem;
  color: #0f172a;
  font-size: 0.76rem;
  font-weight: 800;
  line-height: 1.25;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}

:deep(.map-event-marker.is-selected .map-event-marker-title) {
  border: 2px solid #f97316;
  padding: calc(0.28rem - 1px) calc(0.52rem - 1px);
}

:deep(.map-event-marker:focus-visible .map-event-marker-title) {
  outline: 3px solid rgb(249 115 22 / 35%);
  outline-offset: 2px;
}
</style>
