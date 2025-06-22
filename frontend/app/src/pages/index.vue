<template>
  <div class="min-h-screen bg-gray-50">
      <!-- ヘッダー -->
      <header class="bg-white shadow">
        <div class="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 class="text-2xl font-bold text-red-600">Yosakoi Portal</h1>
          <nav>
            <ul class="flex space-x-6">
              <li><a href="#" class="text-gray-700 hover:text-blue-600">ホーム</a></li>
              <li><a href="#" class="text-gray-700 hover:text-blue-600">イベント</a></li>
              <li><a href="#" class="text-gray-700 hover:text-blue-600">チーム</a></li>
              <li><a href="#" class="text-gray-700 hover:text-blue-600">お問い合わせ</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <!-- メイン -->
      <main class="container mx-auto px-4 py-10">
        <!-- TODO: 熱く踊れ、日本を彩れ。のところ -->
        <section class="mb-10">
          <h2 class="text-xl font-bold mb-4">キーワード検索</h2>
          <InputSection />
        </section>
        <section>
          <h2 class="text-xl font-bold mb-4">よさこい祭り一覧</h2>
          <!-- TODO: EventCardみたいなコンポーネント作成してv-forで回すと楽しいかも -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white rounded-lg shadow p-6">
              <!-- TODO: タイトル、日時、説明は動的に変化するように修正-->
              <h3 class="font-semibold text-lg mb-2">祭りタイトル1</h3>
              <p class="text-gray-600 mb-2">2025年7月1日〜2025年7月2日</p>
              <p class="text-gray-700">祭り説明1</p>
            </div>
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="font-semibold text-lg mb-2">祭りタイトル2</h3>
              <p class="text-gray-600 mb-2">2025年8月1日〜2025年8月2日<</p>
              <p class="text-gray-700">祭り説明2<</p>
            </div>
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="font-semibold text-lg mb-2">祭りタイトル3</h3>
              <p class="text-gray-600 mb-2">2025年9月1日〜2025年9月2日<</p>
              <p class="text-gray-700">祭り説明3</p>
            </div>
          </div>
        </section>
      </main>

      <!-- フッター -->
      <footer class="bg-white border-t mt-10">
        <div class="container mx-auto px-4 py-6 text-center text-gray-500">
          &copy; 2025 Yosakoi Portal
        </div>
      </footer>
    </div>
</template>

<script setup lang="ts">
import InputSection from "~/components/atoms/InputSection.vue";
// import Header from "~/components/utils/Header.vue";
// import Footer from "~/components/utils/Footer.vue";
</script>