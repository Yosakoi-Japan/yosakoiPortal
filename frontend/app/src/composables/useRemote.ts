import Papa from "papaparse";
import type { EventListItem, EventDetail } from "~/types/index";

let cachedEvents: EventDetail[] | null = null;
let csvTextPromise: Promise<string> | null = null;

const parseTeamCount = (value: string) => {
  const digits = value.replace(/[^\d]/g, "");
  if (!digits) {
    return undefined;
  }
  const parsed = Number.parseInt(digits, 10);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const parseCoordinate = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }
  const parsed = Number.parseFloat(trimmed);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const extractYoutubeId = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  if (/^[\w-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);
    if (url.hostname === "youtu.be") {
      return url.pathname.replace("/", "") || undefined;
    }

    if (url.hostname.includes("youtube.com")) {
      const paramId = url.searchParams.get("v");
      if (paramId) {
        return paramId;
      }
      if (url.pathname.startsWith("/embed/")) {
        return url.pathname.replace("/embed/", "") || undefined;
      }
    }
  } catch (e) {
    return undefined;
  }

  return undefined;
};

const CSV_HEADERS = {
  title: "よさこい祭り名",
  imageUrl: "イメージ画像URL",
  officialWebsite: "公式ホームページURL",
  period: "開催期間",
  area: "開催地",
  teamCount: "参加チーム数",
  nearestStation: "最寄り駅",
  parking: "駐車場情報",
  description: "イベント紹介",
  youtube: "動画リンク（YouTube）",
  latitude: "会場緯度",
  longitude: "会場経度",
} as const;

type CsvHeaderKey = keyof typeof CSV_HEADERS;
type CsvRow = Record<string, string>;

const loadCsvText = async (): Promise<string> => {
  if (!csvTextPromise) {
    csvTextPromise = import("~/assets/data/events.csv?raw").then(
      (module: { default: string } | string) => {
        if (typeof module === "string") {
          return module;
        }
        return module.default;
      },
    );
  }
  return csvTextPromise;
};

const parseCsvText = (csvText: string): EventDetail[] => {
  const result = Papa.parse<CsvRow>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.replace(/^\ufeff/, "").trim(),
    transform: (value) =>
      typeof value === "string" ? value.trim() : value ?? "",
  });

  if (result.errors.length) {
    console.warn("CSV parse errors detected:", result.errors);
  }

  const sanitizedRows = result.data.filter((row) =>
    Object.values(row).some((value) => value && value.trim().length > 0),
  );

  const getValue = (row: CsvRow, key: CsvHeaderKey) => {
    const headerName = CSV_HEADERS[key];
    return (row[headerName] ?? "").trim();
  };

  return sanitizedRows.map((row, index) => {
    const title = getValue(row, "title") || `イベント${index + 1}`;
    const periodText = getValue(row, "period");
    const teamCount = parseTeamCount(getValue(row, "teamCount"));
    const latitude = parseCoordinate(getValue(row, "latitude"));
    const longitude = parseCoordinate(getValue(row, "longitude"));
    const youtubeVideoId = extractYoutubeId(getValue(row, "youtube"));

    const eventDetail: EventDetail = {
      id: title.trim() || `event-${index + 1}`,
      title: title.trim() || `イベント${index + 1}`,
      area: getValue(row, "area"),
      description: getValue(row, "description"),
    };

    if (periodText) {
      eventDetail.period = periodText;
    }

    const officialWebsite = getValue(row, "officialWebsite");
    if (officialWebsite) {
      eventDetail.officialWebsite = officialWebsite;
      
    }
    if (teamCount !== undefined) {
      eventDetail.teamCount = teamCount;
    }
    const nearestStation = getValue(row, "nearestStation");
    if (nearestStation) {
      eventDetail.nearestStation = nearestStation;
    }
    const parking = getValue(row, "parking");
    if (parking) {
      eventDetail.parking = parking;
    }
    if (latitude !== undefined) {
      eventDetail.latitude = latitude;
    }
    if (longitude !== undefined) {
      eventDetail.longitude = longitude;
    }
    if (youtubeVideoId) {
      eventDetail.youtubeVideoId = youtubeVideoId;
    }
    if (eventDetail.area) {
      eventDetail.venue = eventDetail.area;
    }

    return eventDetail;
  });
};

const loadEventsFromCsv = async () => {
  if (cachedEvents) {
    return cachedEvents;
  }

  const csvText = await loadCsvText();
  cachedEvents = parseCsvText(csvText);
  return cachedEvents;
};

export function useRemote() {
  const events = ref<EventListItem[]>([]);

  const fetchEvents = async () => {
    try {
      const csvEvents = await loadEventsFromCsv();
      events.value = csvEvents.map((detail) => ({
        id: detail.id,
        title: detail.title,
        area: detail.area,
        description: detail.description,
        period: detail.period,
      }));
    } catch (e) {
      console.error("Failed to load events from CSV:", e);
      events.value = [];
    }
  };

  const fetchEventById = async (id: string): Promise<EventDetail | null> => {
    try {
      const csvEvents = await loadEventsFromCsv();
      return csvEvents.find((event) => event.id === id) ?? null;
    } catch (e) {
      console.error("Failed to load event detail from CSV:", e);
      return null;
    }
  };

  return { events, fetchEvents, fetchEventById };
}
