<template>
  <header class="bg-white shadow">
    <div class="container mx-auto px-4 py-4 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-red-600">Yosakoi Portal</h1>
      <nav>
        <ul class="flex space-x-6">
          <li><NuxtLink to="/" class="text-gray-700 hover:text-blue-600 transition-colors">ホーム</NuxtLink></li>
          <li><NuxtLink to="/guide" class="text-gray-700 hover:text-blue-600 transition-colors">楽しみ方</NuxtLink></li>
          <li><a href="#" class="text-gray-700 hover:text-blue-600 transition-colors">チーム</a></li>
          <li><a href="#" class="text-gray-700 hover:text-blue-600 transition-colors">お問い合わせ</a></li>
        </ul>
      </nav>
    </div>
  </header>
</template>