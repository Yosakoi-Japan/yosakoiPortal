import type { EventListItem, EventDetail } from "~/types/index";

export function useRemote() {
  // TODO:ゆくゆくは環境変数でAPIのURLを切り替える
  const events = ref<EventListItem[]>([]);
  const fetchEvents = async () => {
    try {
      const { data, error } = await useFetch<EventListItem[]>("/api/events");
      if (error.value) {
        throw error.value;
      }
      events.value = data.value ?? [];
    } catch (e) {
      console.error("Failed to fetch events:", e);
    }
  };

  const fetchEventById = async (id: string): Promise<EventDetail | null> => {
    try {
      const { data, error } = await useFetch<EventDetail>(`/api/events/${id}`);
      if (error.value) {
        throw error.value;
      }
      return data.value;
    } catch (e) {
      return null;
    }
  };

  return { events, fetchEvents, fetchEventById };
}
