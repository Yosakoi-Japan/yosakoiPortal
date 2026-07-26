import type { EventListItem } from "~/types/index";

export type EventPeriod = "this-month" | "next-month";

const TOKYO_TIME_ZONE = "Asia/Tokyo";
const WEEKDAY_LABELS = ["日", "月", "火", "水", "木", "金", "土"];

type DateRange = {
  start: string;
  end: string;
};

const toIsoDate = (date: Date) => date.toISOString().slice(0, 10);

const dateFromIso = (isoDate: string) => {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
};

const addDays = (isoDate: string, days: number) => {
  const date = dateFromIso(isoDate);
  date.setUTCDate(date.getUTCDate() + days);
  return toIsoDate(date);
};

export const getTokyoDateIso = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TOKYO_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );

  return `${values.year}-${values.month}-${values.day}`;
};

const getWeekRange = (today: string, offsetWeeks = 0): DateRange => {
  const dayOfWeek = dateFromIso(today).getUTCDay();
  const start = addDays(today, offsetWeeks * 7 - dayOfWeek);
  return { start, end: addDays(start, 6) };
};

const getMonthRange = (today: string, offsetMonths = 0): DateRange => {
  const date = dateFromIso(today);
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + offsetMonths;
  const start = new Date(Date.UTC(year, month, 1));
  const end = new Date(Date.UTC(year, month + 1, 0));

  return {
    start: toIsoDate(start),
    end: toIsoDate(end),
  };
};

export const isUpcomingEvent = (event: EventListItem, today: string) =>
  event.endDate >= today;

export const filterEventsByPeriod = (
  events: EventListItem[],
  period: EventPeriod,
  today: string,
) => {
  const range = getMonthRange(today, period === "next-month" ? 1 : 0);

  return events.filter(
    (event) =>
      isUpcomingEvent(event, today) &&
      event.startDate >= range.start &&
      event.startDate <= range.end,
  );
};

export const getEventTimingLabel = (event: EventListItem, today: string) => {
  if (event.startDate < today && event.endDate >= today) {
    return "開催中";
  }

  const thisWeek = getWeekRange(today);
  const nextWeek = getWeekRange(today, 1);
  const startWeekday = dateFromIso(event.startDate).getUTCDay();
  const isWeekend = startWeekday === 0 || startWeekday === 6;

  if (event.startDate >= thisWeek.start && event.startDate <= thisWeek.end) {
    return isWeekend ? "今週末" : "今週";
  }

  if (event.startDate >= nextWeek.start && event.startDate <= nextWeek.end) {
    return isWeekend ? "来週末" : "来週";
  }

  const thisMonth = getMonthRange(today);
  if (event.startDate >= thisMonth.start && event.startDate <= thisMonth.end) {
    return "今月";
  }

  return `${dateFromIso(event.startDate).getUTCMonth() + 1}月以降`;
};

export const getEventDateDisplay = (event: EventListItem) => {
  const start = dateFromIso(event.startDate);
  const end = dateFromIso(event.endDate);
  const startMonth = start.getUTCMonth() + 1;
  const endMonth = end.getUTCMonth() + 1;

  return {
    start: {
      value: `${startMonth}/${start.getUTCDate()}`,
      weekday: WEEKDAY_LABELS[start.getUTCDay()],
      weekdayIndex: start.getUTCDay(),
    },
    end:
      event.startDate === event.endDate
        ? undefined
        : {
            value:
              startMonth === endMonth
                ? `${end.getUTCDate()}`
                : `${endMonth}/${end.getUTCDate()}`,
            weekday: WEEKDAY_LABELS[end.getUTCDay()],
            weekdayIndex: end.getUTCDay(),
          },
  };
};

export const getShortArea = (area: string) => {
  const withoutVenueDetail = area.split(/[（(]/, 1)[0].trim();
  const prefecture = withoutVenueDetail.match(
    /^(北海道|東京都|京都府|大阪府|[^\s　（(]+県)/,
  );
  if (!prefecture) {
    return withoutVenueDetail;
  }

  const municipality = withoutVenueDetail
    .slice(prefecture[0].length)
    .match(/^.*?(?:市|区|郡.*?[町村]|[町村])/);

  return municipality
    ? `${prefecture[0]}${municipality[0]}`
    : withoutVenueDetail;
};
