import { parse } from "csv-parse/sync";
import { useStorage } from "nitropack/runtime";
import { resolve } from "node:path";
import type { EventDetail, EventListItem } from "~/types/index";

let cachedEvents: EventDetail[] | null = null;
let duplicateIds: Set<string> | null = null;

const FIELD_KEYS = {
  eventId: ["event_id"],
  eventName: ["event_name"],
  status: ["status", "Status"],
  officialUrl: ["official_url"],
  startDate: ["start_date"],
  endDate: ["end_date"],
  location: ["location"],
  description: ["description"],
  youtubeUrl: ["youtube_url"],
  latitude: ["latitude"],
  longitude: ["longitude"],
  mapUrl: ["map_url"],
  updatedAt: ["updated_at"],
  imageUrl: ["image_url"],
  teamCount: ["team_count"],
  nearestStation: ["nearest_station"],
  parkingInfo: ["parking_info"],
} as const;

const REQUIRED_FIELDS = [
  "eventId",
  "eventName",
  "status",
  "officialUrl",
  "startDate",
  "endDate",
  "location",
  "description",
  "updatedAt",
] as const;

type CsvRow = Record<string, string>;

const getTrimmed = (row: CsvRow, key: string) => (row[key] ?? "").trim();

const getFieldValue = (row: CsvRow, field: keyof typeof FIELD_KEYS) => {
  const keys = FIELD_KEYS[field];
  for (const key of keys) {
    const value = getTrimmed(row, key);
    if (value) {
      return value;
    }
  }
  return "";
};

const isValidDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value);

const formatPeriod = (startDate: string, endDate: string) =>
  startDate === endDate ? startDate : `${startDate} - ${endDate}`;

const compareEventsByDate = (a: EventDetail, b: EventDetail) => {
  if (a.startDate !== b.startDate) {
    return a.startDate.localeCompare(b.startDate);
  }

  if (a.endDate !== b.endDate) {
    return a.endDate.localeCompare(b.endDate);
  }

  return a.title.localeCompare(b.title, "ja");
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
  } catch {
    return undefined;
  }

  return undefined;
};

const parseCsvText = (csvText: string): EventDetail[] => {
  const rows = parse(csvText.replace(/^\ufeff/, ""), {
    columns: (header) => header.map((column) => column.trim()),
    skip_empty_lines: true,
    trim: true,
  }) as CsvRow[];

  const sanitizedRows = rows.filter((row) =>
    Object.values(row).some((value) => value && value.trim().length > 0),
  );

  const idCounts = new Map<string, number>();
  for (const row of sanitizedRows) {
    const eventId = getTrimmed(row, "event_id");
    if (!eventId) {
      continue;
    }
    idCounts.set(eventId, (idCounts.get(eventId) ?? 0) + 1);
  }

  duplicateIds = new Set(
    [...idCounts.entries()]
      .filter(([, count]) => count > 1)
      .map(([eventId]) => eventId),
  );

  return sanitizedRows.flatMap((row) => {
    const missingRequired = REQUIRED_FIELDS.some(
      (field) => !getFieldValue(row, field),
    );
    const eventId = getFieldValue(row, "eventId");

    if (missingRequired || !eventId || duplicateIds.has(eventId)) {
      return [];
    }

    const startDate = getFieldValue(row, "startDate");
    const endDate = getFieldValue(row, "endDate");
    const latitude = parseCoordinate(getFieldValue(row, "latitude"));
    const longitude = parseCoordinate(getFieldValue(row, "longitude"));

    if (!isValidDate(startDate) || !isValidDate(endDate)) {
      return [];
    }

    const youtubeUrl = getFieldValue(row, "youtubeUrl");
    const youtubeVideoId = extractYoutubeId(youtubeUrl);
    const mapUrl = getFieldValue(row, "mapUrl");

    const eventDetail: EventDetail = {
      id: eventId,
      title: getFieldValue(row, "eventName"),
      area: getFieldValue(row, "location"),
      description: getFieldValue(row, "description"),
      period: formatPeriod(startDate, endDate),
      startDate,
      endDate,
      officialWebsite: getFieldValue(row, "officialUrl"),
      venue: getFieldValue(row, "location"),
    };

    const imageUrl = getFieldValue(row, "imageUrl");
    if (imageUrl) {
      eventDetail.imageUrl = imageUrl;
    }

    const teamCountText = getFieldValue(row, "teamCount");
    if (teamCountText) {
      eventDetail.teamCountText = teamCountText;
    }

    const nearestStation = getFieldValue(row, "nearestStation");
    if (nearestStation) {
      eventDetail.nearestStation = nearestStation;
    }

    const parking = getFieldValue(row, "parkingInfo");
    if (parking) {
      eventDetail.parking = parking;
    }

    if (youtubeUrl) {
      eventDetail.youtubeUrl = youtubeUrl;
    }

    if (youtubeVideoId) {
      eventDetail.youtubeVideoId = youtubeVideoId;
    }

    if (latitude !== undefined) {
      eventDetail.latitude = latitude;
    }

    if (longitude !== undefined) {
      eventDetail.longitude = longitude;
    }

    if (mapUrl) {
      eventDetail.mapUrl = mapUrl;
    }

    return [eventDetail];
  });
};

export const loadEventsFromCsv = async () => {
  if (cachedEvents) {
    return cachedEvents;
  }

  const csvText = import.meta.dev
    ? await import("node:fs/promises").then((fs) =>
        fs.readFile(
          resolve(process.cwd(), "src/assets/data/yosakoi_event.csv"),
          "utf8",
        )
      )
    : await useStorage().getItem<string>(
        "/assets/server/data/yosakoi_event.csv",
      );

  if (!csvText) {
    throw new Error("EVENT_CSV_NOT_FOUND");
  }

  cachedEvents = parseCsvText(csvText).sort(compareEventsByDate);
  return cachedEvents;
};

export const loadEventList = async (): Promise<EventListItem[]> => {
  const events = await loadEventsFromCsv();
  return events.map((detail) => ({
    id: detail.id,
    title: detail.title,
    area: detail.area,
    description: detail.description,
    period: detail.period,
  }));
};

export const loadEventById = async (id: string): Promise<EventDetail | null> => {
  const events = await loadEventsFromCsv();
  if (duplicateIds?.has(id)) {
    throw new Error("DUPLICATE_EVENT_ID");
  }
  return events.find((event) => event.id === id) ?? null;
};
