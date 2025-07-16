<template>
  <div class="min-h-screen bg-gray-50">
    <Header />
    <!-- ヒーロー画像 -->
    <HeroImage />

    <!-- メイン -->
    <main class="container mx-auto px-4 py-10">
      <section class="mb-10">
        <h2 class="text-xl font-bold mb-4">キーワード検索</h2>
        <InputSection />
      </section>
      <section>
        <h2 class="text-xl font-bold mb-4">よさこい祭り一覧</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <EventCard
            v-for="event in events"
            :key="event.id"
            :title="event.title"
            :area="event.area"
            :startDate="event.startDate"
            :endDate="event.endDate"
            :description="event.description"
            @click="handleEventClick"
          />
        </div>
      </section>
    </main>

    <!-- フッター -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
import InputSection from "~/components/atoms/InputSection.vue";
import Header from "~/components/utils/Header.vue";
import Footer from "~/components/utils/Footer.vue";
import EventCard from "~/components/atoms/EventCard.vue";
import HeroImage from "~/components/atoms/HeroImage.vue";
import { useRemote } from "~/composables/useRemote";

const { events, fetchEvents } = useRemote();

const handleEventClick = (event: {
  title: string;
  startDate: string;
  endDate: string;
  area: string;
  description: string;
}) => {
  // イベント一覧から該当するイベントを検索してIDを取得
  const eventData = events.value.find((e) => e.title === event.title);
  const eventId = eventData?.id || "unknown";

  navigateTo(`/event/${eventId}`);
};

onMounted(() => {
  fetchEvents();
});
</script>
