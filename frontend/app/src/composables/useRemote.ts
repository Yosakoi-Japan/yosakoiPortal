import type { Event } from "~/types/index";

export function useRemote() {
  // TODO:ゆくゆくは環境変数でAPIのURLを切り替える
  const events = ref<Event[]>([]);
  const fetchEvents = async () => {
    try {
      const { data, error } = await useFetch<Event[]>("/api/events");
      if (error.value) {
        throw error.value;
      }
      events.value = data.value ?? [];
    } catch (e) {
      console.error("Failed to fetch events:", e);
    }
  };

  return { events, fetchEvents };
}
