<template>
  <div class="min-h-screen bg-gray-50">
    <Header />

    <main class="container mx-auto px-4 py-10">
      <div class="max-w-4xl mx-auto">
        <!-- 戻るボタン -->
        <button
          @click="$router.back()"
          class="flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <svg
            class="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          戻る
        </button>

        <!-- ローディング状態 -->
        <div v-if="isLoading" class="text-center py-10">
          <div
            class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
          ></div>
          <p class="mt-2 text-gray-600">読み込み中...</p>
        </div>

        <!-- エラー状態 -->
        <div v-else-if="error" class="text-center py-10">
          <p class="text-red-600 mb-4">{{ error }}</p>
          <button
            @click="$router.push('/')"
            class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            トップページに戻る
          </button>
        </div>

        <!-- イベント詳細 -->
        <div
          v-else-if="event"
          class="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <!-- イベント画像 -->
          <div
            class="h-64 md:h-96 bg-gradient-to-r from-red-400 to-pink-500 flex items-center justify-center"
          >
            <div class="text-white text-center">
              <h1 class="text-3xl md:text-5xl font-bold mb-2">
                {{ event?.title }}
              </h1>
              <p class="text-lg md:text-xl">{{ event?.area }}</p>
            </div>
          </div>

          <!-- イベント情報 -->
          <div class="p-6 md:p-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <!-- 基本情報 -->
              <div>
                <h2 class="text-2xl font-bold mb-4">基本情報</h2>
                <div class="space-y-4">
                  <div>
                    <h3 class="font-semibold text-gray-700">
                      公式ホームページ
                    </h3>
                    <a
                      :href="event.officialWebsite"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-blue-600 hover:text-blue-800 underline"
                    >
                      <p class="text-gray-600">{{ event.officialWebsite }}</p>
                    </a>
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-700">開催期間</h3>
                    <p class="text-gray-600">
                      {{ event?.startDate }}〜{{ event?.endDate }}
                    </p>
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-700">開催地</h3>
                    <p class="text-gray-600">{{ event?.area }}</p>
                  </div>
                  <div v-if="event?.teamCount">
                    <h3 class="font-semibold text-gray-700">参加チーム数</h3>
                    <p class="text-gray-600">約{{ event.teamCount }}チーム</p>
                  </div>
                </div>
              </div>

              <!-- アクセス情報 -->
              <div>
                <h2 class="text-2xl font-bold mb-4">アクセス</h2>
                <div class="space-y-4">
                  <div v-if="event?.nearestStation">
                    <h3 class="font-semibold text-gray-700">最寄り駅</h3>
                    <p class="text-gray-600">{{ event.nearestStation }}</p>
                  </div>
                  <div v-if="event?.parking">
                    <h3 class="font-semibold text-gray-700">駐車場</h3>
                    <p class="text-gray-600">{{ event.parking }}</p>
                  </div>
                  <div v-if="event?.contact">
                    <h3 class="font-semibold text-gray-700">お問い合わせ</h3>
                    <p class="text-gray-600">
                      {{ event.contact.organization }}
                    </p>
                    <p class="text-gray-600">
                      <a
                        :href="`tel:${event.contact.phoneNumber}`"
                        class="text-blue-600 hover:text-blue-800"
                      >
                        TEL: {{ event.contact.phoneNumber }}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- 詳細説明 -->
            <div class="mt-8">
              <h2 class="text-2xl font-bold mb-4">イベント詳細</h2>
              <div class="prose max-w-none">
                <p class="text-gray-700 leading-relaxed">
                  {{ event?.description }}
                </p>
                <p
                  v-if="event?.additionalInfo"
                  class="text-gray-700 leading-relaxed mt-4"
                >
                  {{ event.additionalInfo }}
                </p>
              </div>
            </div>

            <!-- 注意事項 -->
            <div
              class="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6"
            >
              <h3 class="font-semibold text-yellow-800 mb-2">注意事項</h3>
              <ul class="text-yellow-700 space-y-1">
                <li>・最新情報は公式ホームページをご確認ください</li>
                <li>・天候により開催内容が変更される場合があります</li>
                <li>・会場内での撮影について制限がある場合があります</li>
                <li>・ゴミは各自でお持ち帰りください</li>
                <li>・熱中症対策を十分に行ってください</li>
              </ul>
            </div>

            <!-- Google MAP -->
            <div v-if="event?.latitude && event?.longitude" class="mt-8">
              <h2 class="text-2xl font-bold mb-4">会場マップ</h2>
              <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                <div class="p-4 bg-gray-50 border-b">
                  <h3 class="font-semibold text-gray-700">
                    {{ event?.venue || "会場" }}
                  </h3>
                </div>
                <div class="h-96">
                  <iframe
                    :src="`https://maps.google.com/maps?q=${event.latitude},${event.longitude}&hl=ja&z=15&output=embed`"
                    width="100%"
                    height="100%"
                    style="border: 0"
                    allowfullscreen=""
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"
                    class="w-full h-full"
                  ></iframe>
                </div>
                <div class="p-4 bg-gray-50 border-t">
                  <p class="text-sm text-gray-600">
                    <a
                      :href="`https://www.google.com/maps/search/?api=1&query=${event.latitude},${event.longitude}`"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-blue-600 hover:text-blue-800 underline"
                    >
                      Google マップで開く
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import Header from "~/components/utils/Header.vue";
import Footer from "~/components/utils/Footer.vue";
import { useRemote } from "~/composables/useRemote";
import type { EventDetail } from "~/types/index";

const route = useRoute();
const { fetchEventById } = useRemote();

// URLからイベントIDを取得
const eventId = route.params.id as string;

// イベントデータを取得
const event = ref<EventDetail | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

// APIからイベントデータを取得
onMounted(async () => {
  try {
    isLoading.value = true;
    const eventData = await fetchEventById(eventId);

    if (eventData) {
      event.value = eventData;
    } else {
      error.value = "イベントが見つかりませんでした";
    }
  } catch (e) {
    error.value = "イベントの取得に失敗しました";
  } finally {
    isLoading.value = false;
  }
});
</script>
