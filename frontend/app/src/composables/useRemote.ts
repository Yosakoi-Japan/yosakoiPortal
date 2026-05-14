import type { EventDetail, EventListItem } from "~/types/index";

export function useRemote() {
  const events = ref<EventListItem[]>([]);

  const fetchEvents = async () => {
    try {
      events.value = await $fetch<EventListItem[]>("/api/events");
    } catch (error) {
      console.error("Failed to load events from API:", error);
      events.value = [];
    }
  };

  const fetchEventById = async (id: string): Promise<EventDetail | null> => {
    try {
      return await $fetch<EventDetail>(`/api/events/${id}`);
    } catch (error) {
      const statusCode = typeof error === "object" &&
        error !== null &&
        "statusCode" in error
        ? Number(error.statusCode)
        : undefined;
      const statusMessage = typeof error === "object" &&
        error !== null &&
        "statusMessage" in error
        ? String(error.statusMessage)
        : undefined;

      if (statusCode === 404) {
        return null;
      }

      if (statusMessage === "DUPLICATE_EVENT_ID") {
        throw new Error("DUPLICATE_EVENT_ID");
      }

      console.error("Failed to load event detail from API:", error);
      throw error;
    }
  };

  return { events, fetchEvents, fetchEventById };
}
