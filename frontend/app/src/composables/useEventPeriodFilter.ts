import type { EventPeriod } from "~/utils/eventDisplay";

const periodFromQuery = (period: unknown): EventPeriod =>
  period === "next-month" ? "next-month" : "this-month";

export function useEventPeriodFilter() {
  const route = useRoute();
  const router = useRouter();
  const selectedPeriod = ref<EventPeriod>(periodFromQuery(route.query.period));

  const setSelectedPeriod = (period: EventPeriod) => {
    selectedPeriod.value = period;

    const query = { ...route.query };
    if (period === "next-month") {
      query.period = period;
    } else {
      delete query.period;
    }

    void router.replace({ query });
  };

  watch(
    () => route.query.period,
    (period) => {
      selectedPeriod.value = periodFromQuery(period);
    },
  );

  return { selectedPeriod, setSelectedPeriod };
}
