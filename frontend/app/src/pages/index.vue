<template>
  <div class="min-h-screen bg-gray-50">
    <Header />

    <!-- メイン -->
    <main class="container mx-auto px-4 py-10">
      <!-- TODO: 熱く踊れ、日本を彩れ。のところ -->
      <section class="mb-10">
        <h2 class="text-xl font-bold mb-4">キーワード検索</h2>
        <InputSection />
      </section>
      <section>
        <h2 class="text-xl font-bold mb-4">よさこい祭り一覧</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <EventCard
            v-for="event in events"
            :key="event.title"
            :title="event.title"
            :area="event.area"
            :startDate="event.startDate"
            :endDate="event.endDate"
            :description="event.description"
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
import { useRemote } from "~/composables/useRemote"

const { events, fetchEvents } = useRemote();

onMounted(() => {
  fetchEvents();
});
</script>
