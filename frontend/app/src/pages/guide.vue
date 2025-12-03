<template>
  <div class="min-h-screen bg-gray-50">
    <Header />

    <!-- ヒーロー セクション -->
    <section
      class="relative bg-gradient-to-r from-red-500 to-pink-500 text-white py-20"
    >
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-3xl md:text-6xl font-bold mb-12">
            よさこいの世界へ
            <span class="block text-yellow-300">ようこそ！</span>
          </h1>
          <p class="text-lg md:text-2xl mb-8">
            初めてでも大丈夫！よさこい祭りの楽しみ方を分かりやすくご紹介します
          </p>
        </div>
      </div>
    </section>

    <main class="container mx-auto px-4 py-16">
      <!-- よさこいって何？ -->
      <section class="mb-20">
        <div class="max-w-6xl mx-auto">
          <h2
            class="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800"
          >
            🎌 よさこいって何？
          </h2>
          <!-- よさこい祭りの画像 -->
          <div
            class="rounded-2xl overflow-hidden shadow-lg mb-12 max-w-4xl mx-auto"
          >
            <img
              src="/about_image.jpg"
              alt="よさこい祭りの踊り子たち"
              class="w-full h-64 md:h-80 object-cover"
            />
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
            <div>
              <div
                class="bg-gradient-to-br from-red-100 to-pink-100 rounded-2xl p-8 h-full"
              >
                <h3 class="text-2xl font-bold mb-4 text-red-600">
                  伝統と革新の融合
                </h3>
                <p class="text-gray-700 leading-relaxed mb-4">
                  よさこいは、高知県発祥の伝統的な踊りに現代的な要素を取り入れた、エネルギッシュで創造的な祭りです。
                </p>
                <p class="text-gray-700 leading-relaxed mb-4">
                  鳴子（なるこ）を手に持ち、チーム独自の楽曲と振り付けで踊る姿は圧巻！
                </p>
              </div>
            </div>
            <div class="bg-white rounded-2xl shadow-lg p-8 h-full">
              <h3 class="text-2xl font-bold mb-6 text-gray-800">
                よさこいの魅力
              </h3>
              <div class="space-y-4">
                <div class="flex items-start space-x-3">
                  <span class="text-2xl">✨</span>
                  <div>
                    <h4 class="font-bold text-gray-800">
                      圧倒的なパフォーマンス
                    </h4>
                    <p class="text-gray-600">一斉に踊る迫力は必見</p>
                  </div>
                </div>
                <div class="flex items-start space-x-3">
                  <span class="text-2xl">🎨</span>
                  <div>
                    <h4 class="font-bold text-gray-800">多様な表現</h4>
                    <p class="text-gray-600">
                      チームごとに異なる衣装・音楽・振り付け
                    </p>
                  </div>
                </div>
                <div class="flex items-start space-x-3">
                  <span class="text-2xl">🤝</span>
                  <div>
                    <h4 class="font-bold text-gray-800">一体感</h4>
                    <p class="text-gray-600">
                      観客も一緒に楽しめるアットホームな雰囲気
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 楽しみ方ガイド -->
      <section class="mb-20">
        <div class="max-w-6xl mx-auto">
          <h2
            class="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800"
          >
            🎯 初心者のための楽しみ方
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- 観る楽しみ -->
            <div
              class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow flex flex-col"
            >
              <div class="bg-gradient-to-r from-blue-400 to-blue-600 p-6">
                <div class="text-center">
                  <span class="text-4xl mb-2 block">👀</span>
                  <h3 class="text-xl font-bold text-white">観る楽しみ</h3>
                </div>
              </div>
              <div class="p-6 flex-1 flex flex-col">
                <ul class="space-y-3 text-gray-700 flex-1">
                  <li class="flex items-start space-x-2">
                    <span class="text-blue-500">•</span>
                    <span>迫力ある踊りに圧倒される</span>
                  </li>
                  <li class="flex items-start space-x-2">
                    <span class="text-blue-500">•</span>
                    <span>美しい衣装の違いを楽しむ</span>
                  </li>
                  <li class="flex items-start space-x-2">
                    <span class="text-blue-500">•</span>
                    <span>チームごとの特色を比較</span>
                  </li>
                  <li class="flex items-start space-x-2">
                    <span class="text-blue-500">•</span>
                    <span>写真・動画撮影（※ルール確認）</span>
                  </li>
                </ul>
                <div class="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p class="text-sm text-blue-700">
                    <strong>おすすめポイント：</strong>
                    最前列で観ると迫力満点！
                  </p>
                </div>
              </div>
            </div>

            <!-- 参加する楽しみ -->
            <div
              class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow flex flex-col"
            >
              <div class="bg-gradient-to-r from-green-400 to-green-600 p-6">
                <div class="text-center">
                  <span class="text-4xl mb-2 block">🕺</span>
                  <h3 class="text-xl font-bold text-white">参加する楽しみ</h3>
                </div>
              </div>
              <div class="p-6 flex-1 flex flex-col">
                <ul class="space-y-3 text-gray-700 flex-1">
                  <li class="flex items-start space-x-2">
                    <span class="text-green-500">•</span>
                    <span>飛び入り参加OKのチームも</span>
                  </li>
                  <li class="flex items-start space-x-2">
                    <span class="text-green-500">•</span>
                    <span>観客席から手拍子で応援</span>
                  </li>
                  <li class="flex items-start space-x-2">
                    <span class="text-green-500">•</span>
                    <span>地元チームを応援</span>
                  </li>
                </ul>
                <div class="mt-4 p-3 bg-green-50 rounded-lg">
                  <p class="text-sm text-green-700">
                    <strong>おすすめポイント：</strong>
                    一体感を味わえる最高の体験！
                  </p>
                </div>
              </div>
            </div>

            <!-- 食べる楽しみ -->
            <div
              class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow flex flex-col"
            >
              <div class="bg-gradient-to-r from-orange-400 to-orange-600 p-6">
                <div class="text-center">
                  <span class="text-4xl mb-2 block">🍜</span>
                  <h3 class="text-xl font-bold text-white">食べる楽しみ</h3>
                </div>
              </div>
              <div class="p-6 flex-1 flex flex-col">
                <ul class="space-y-3 text-gray-700 flex-1">
                  <li class="flex items-start space-x-2">
                    <span class="text-orange-500">•</span>
                    <span>地元グルメの屋台巡り</span>
                  </li>
                  <li class="flex items-start space-x-2">
                    <span class="text-orange-500">•</span>
                    <span>お祭り限定メニュー</span>
                  </li>
                  <li class="flex items-start space-x-2">
                    <span class="text-orange-500">•</span>
                    <span>地域の特産品お土産</span>
                  </li>
                </ul>
                <div class="mt-4 p-3 bg-orange-50 rounded-lg">
                  <p class="text-sm text-orange-700">
                    <strong>おすすめポイント：</strong>
                    踊りと一緒に地域文化も堪能！
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 初心者向けTips -->
      <section class="mb-20">
        <div class="max-w-4xl mx-auto">
          <h2
            class="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800"
          >
            💡 初心者のためのお役立ちTips
          </h2>
          <div class="bg-white rounded-2xl shadow-lg p-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3
                  class="text-xl font-bold mb-4 text-gray-800 flex items-center"
                >
                  <span class="text-2xl mr-2">👕</span>
                  服装・持ち物
                </h3>
                <ul class="space-y-2 text-gray-700">
                  <li>• 動きやすい服装（カジュアルでOK）</li>
                  <li>• 歩きやすい靴</li>
                  <li>• 帽子・日焼け止め（屋外の場合）</li>
                  <li>• タオル・飲み物</li>
                  <li>• カメラ・スマホ（充電忘れずに）</li>
                </ul>
              </div>
              <div>
                <h3
                  class="text-xl font-bold mb-4 text-gray-800 flex items-center"
                >
                  <span class="text-2xl mr-2">⏰</span>
                  タイムスケジュール
                </h3>
                <ul class="space-y-2 text-gray-700">
                  <li>• 開始30分前には会場到着</li>
                  <li>• 人気チームは早めに場所取り</li>
                  <li>• 休憩時間に屋台を楽しむ</li>
                  <li>• 終了後の余韻も楽しみの一つ</li>
                  <li>• 帰りの交通手段を事前確認</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- よくある質問 -->
      <section class="mb-20">
        <div class="max-w-4xl mx-auto">
          <h2
            class="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800"
          >
            ❓ よくある質問
          </h2>
          <div class="space-y-6">
            <div class="bg-white rounded-xl shadow-lg p-6">
              <h3 class="text-lg font-bold mb-3 text-gray-800">
                Q. 一人で参加しても楽しめますか？
              </h3>
              <p class="text-gray-700">
                A.
                もちろんです！多くの方が一人で来場され、現地で演舞を楽しんでいます！
              </p>
            </div>

            <div class="bg-white rounded-xl shadow-lg p-6">
              <h3 class="text-lg font-bold mb-3 text-gray-800">
                Q. 入場料はかかりますか？
              </h3>
              <p class="text-gray-700">
                A.
                ほとんどのよさこい祭りは無料で観覧できます。一部の特別席や室内会場は有料の場合があります。
              </p>
            </div>

            <div class="bg-white rounded-xl shadow-lg p-6">
              <h3 class="text-lg font-bold mb-3 text-gray-800">
                Q. 雨の日はどうなりますか？
              </h3>
              <p class="text-gray-700">
                A.
                小雨程度なら決行されることが多いですが、荒天の場合は中止や屋内会場への変更があります。事前に公式情報をご確認ください。
              </p>
            </div>

            <div class="bg-white rounded-xl shadow-lg p-6">
              <h3 class="text-lg font-bold mb-3 text-gray-800">
                Q. 写真撮影はできますか？
              </h3>
              <p class="text-gray-700">
                A.
                基本的には可能ですが、フラッシュ撮影や商用利用は禁止されている場合があります。各祭りのルールをご確認ください。
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- アクション誘導 -->
      <section>
        <div class="max-w-4xl mx-auto text-center">
          <div
            class="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl p-12"
          >
            <h2 class="text-3xl md:text-4xl font-bold mb-6">
              さあ、よさこいの世界へ飛び込もう！
            </h2>
            <p class="text-xl mb-8">
              最初の一歩は今この瞬間から。あなたの近くで開催されるよさこい祭りを見つけて、
              <br class="hidden md:block" />
              感動の体験を始めましょう！
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <NuxtLink
                to="/"
                class="bg-white text-red-500 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors inline-block"
              >
                祭り一覧を見る
              </NuxtLink>
            </div>
          </div>
        </div>
      </section>
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import Header from "~/components/utils/Header.vue";
import Footer from "~/components/utils/Footer.vue";

// SEO設定
useHead({
  title: "よさこい初心者ガイド - よさこいの楽しみ方を分かりやすく解説",
  meta: [
    {
      name: "description",
      content:
        "よさこい祭りが初めての方向けの完全ガイド。観る楽しみ、参加する楽しみ、食べる楽しみなど、よさこいの魅力を分かりやすくご紹介します。",
    },
    {
      property: "og:title",
      content: "よさこい初心者ガイド - よさこいポータル",
    },
    {
      property: "og:description",
      content:
        "よさこい祭りの楽しみ方を初心者にも分かりやすく解説。観る・参加する・食べる、3つの楽しみ方をご紹介します。",
    },
  ],
});
</script>
