import type { AwardWinnerVideo } from "~/types/index";
import { parseCsvRows, type CsvRow } from "~/utils/csv";
import { extractYoutubeVideoId } from "~/utils/youtube";

const PUBLICATION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_TIMEOUT_MS = 2_147_483_647;
const ISO_TIMESTAMP_WITH_TIMEZONE = /(?:Z|[+-]\d{2}:\d{2})$/i;

let cachedAwardWinnerVideos: AwardWinnerVideo[] | null = null;
let awardWinnersTextPromise: Promise<string> | null = null;
let eventsTextPromise: Promise<string> | null = null;

const getTrimmed = (row: CsvRow, key: string) => (row[key] ?? "").trim();

const isSafeHttpUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
};

const parsePublishedAt = (value: string) => {
  if (!ISO_TIMESTAMP_WITH_TIMEZONE.test(value)) {
    return undefined;
  }

  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : undefined;
};

const loadCsvTexts = async () => {
  awardWinnersTextPromise ??= import(
    "~/assets/data/award_winners.csv?raw"
  ).then((module: { default: string } | string) =>
    typeof module === "string" ? module : module.default,
  );
  eventsTextPromise ??= import("~/assets/data/yosakoi_event.csv?raw").then(
    (module: { default: string } | string) =>
      typeof module === "string" ? module : module.default,
  );

  return Promise.all([awardWinnersTextPromise, eventsTextPromise]);
};

const buildEventNameMap = (rows: CsvRow[]) => {
  const eventIdCounts = new Map<string, number>();
  for (const row of rows) {
    const eventId = getTrimmed(row, "event_id");
    if (eventId) {
      eventIdCounts.set(eventId, (eventIdCounts.get(eventId) ?? 0) + 1);
    }
  }

  return new Map(
    rows.flatMap((row) => {
      const eventId = getTrimmed(row, "event_id");
      const eventName = getTrimmed(row, "event_name");
      if (!eventId || !eventName || eventIdCounts.get(eventId) !== 1) {
        return [];
      }
      return [[eventId, eventName] as const];
    }),
  );
};

const parseAwardWinnerVideos = (
  awardRows: CsvRow[],
  eventNameMap: Map<string, string>,
) => {
  const rowKeyCounts = new Map<string, number>();
  for (const row of awardRows) {
    const rowKey = [
      getTrimmed(row, "event_id"),
      getTrimmed(row, "award_name"),
      getTrimmed(row, "team_name"),
    ].join("::");
    rowKeyCounts.set(rowKey, (rowKeyCounts.get(rowKey) ?? 0) + 1);
  }

  return awardRows.flatMap((row, index) => {
    const eventId = getTrimmed(row, "event_id");
    const awardName = getTrimmed(row, "award_name");
    const teamName = getTrimmed(row, "team_name");
    const resultSourceUrl = getTrimmed(row, "result_source_url");
    const videoUrl = getTrimmed(row, "video_url");
    const videoSourceType = getTrimmed(row, "video_source_type");
    const status = getTrimmed(row, "status");
    const publishedAt = getTrimmed(row, "updated_at");
    const eventName = eventNameMap.get(eventId);
    const youtubeVideoId = extractYoutubeVideoId(videoUrl);
    const publishedAtTimestamp = parsePublishedAt(publishedAt);
    const rowKey = [eventId, awardName, teamName].join("::");

    if (status !== "Approved") {
      return [];
    }

    const isValid =
      Boolean(eventId && eventName && awardName && teamName && videoSourceType) &&
      isSafeHttpUrl(resultSourceUrl) &&
      isSafeHttpUrl(videoUrl) &&
      Boolean(youtubeVideoId) &&
      publishedAtTimestamp !== undefined &&
      rowKeyCounts.get(rowKey) === 1;

    if (!isValid || !eventName || !youtubeVideoId || publishedAtTimestamp === undefined) {
      console.warn(`Award winner row ${index + 2} was skipped because it is invalid.`);
      return [];
    }

    const expiresAtTimestamp = publishedAtTimestamp + PUBLICATION_DURATION_MS;
    return [
      {
        id: `${rowKey}::${publishedAt}`,
        eventId,
        eventName,
        awardName,
        teamName,
        resultSourceUrl,
        videoUrl,
        videoSourceType,
        youtubeVideoId,
        publishedAt: new Date(publishedAtTimestamp).toISOString(),
        expiresAt: new Date(expiresAtTimestamp).toISOString(),
      } satisfies AwardWinnerVideo,
    ];
  });
};

const loadAwardWinnerVideos = async () => {
  if (cachedAwardWinnerVideos) {
    return cachedAwardWinnerVideos;
  }

  const [awardWinnersText, eventsText] = await loadCsvTexts();
  const awardResult = parseCsvRows(awardWinnersText);
  const eventResult = parseCsvRows(eventsText);

  if (awardResult.errors.length || eventResult.errors.length) {
    console.warn("CSV parse errors detected while loading award winners.", {
      awardWinnerErrors: awardResult.errors,
      eventErrors: eventResult.errors,
    });
  }

  const eventNameMap = buildEventNameMap(eventResult.rows);
  cachedAwardWinnerVideos = parseAwardWinnerVideos(
    awardResult.rows,
    eventNameMap,
  ).sort(
    (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt),
  );

  return cachedAwardWinnerVideos;
};

export const filterPublishedAwardWinnerVideos = (
  videos: AwardWinnerVideo[],
  now: Date,
) => {
  const nowTimestamp = now.getTime();
  return videos.filter((video) => {
    const publishedAt = Date.parse(video.publishedAt);
    const expiresAt = Date.parse(video.expiresAt);
    return publishedAt <= nowTimestamp && nowTimestamp < expiresAt;
  });
};

export function useAwardWinners() {
  const awardWinnerVideos = ref<AwardWinnerVideo[]>([]);
  let allVideos: AwardWinnerVideo[] = [];
  let boundaryTimer: ReturnType<typeof setTimeout> | undefined;

  const clearBoundaryTimer = () => {
    if (boundaryTimer !== undefined) {
      clearTimeout(boundaryTimer);
      boundaryTimer = undefined;
    }
  };

  const refreshPublishedVideos = (now = new Date()) => {
    clearBoundaryTimer();
    awardWinnerVideos.value = filterPublishedAwardWinnerVideos(allVideos, now);

    const nowTimestamp = now.getTime();
    const nextBoundary = allVideos
      .flatMap((video) => [
        Date.parse(video.publishedAt),
        Date.parse(video.expiresAt),
      ])
      .filter((timestamp) => timestamp > nowTimestamp)
      .sort((a, b) => a - b)[0];

    if (nextBoundary !== undefined) {
      const delay = Math.min(
        Math.max(nextBoundary - nowTimestamp + 50, 0),
        MAX_TIMEOUT_MS,
      );
      boundaryTimer = setTimeout(() => refreshPublishedVideos(), delay);
    }
  };

  const fetchAwardWinnerVideos = async () => {
    try {
      allVideos = await loadAwardWinnerVideos();
      refreshPublishedVideos();
    } catch (error) {
      console.error("Failed to load award winner videos:", error);
      allVideos = [];
      awardWinnerVideos.value = [];
    }
  };

  onScopeDispose(clearBoundaryTimer);

  return { awardWinnerVideos, fetchAwardWinnerVideos };
}
