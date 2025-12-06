<template>
  <footer class="bg-white border-t">
    <div class="container mx-auto px-4 py-6 flex justify-between items-center flex-wrap">
      <div class="flex flex-wrap gap-6 text-sm">
        <NuxtLink
          v-if="route.path !== '/'"
          to="/"
          class="px-4 py-2 rounded-full bg-pink-100 text-pink-700 hover:bg-pink-200 transition"
        >
          戻る
        </NuxtLink>
        <NuxtLink
          v-else
          to="/terms"
          class="px-4 py-2 rounded-full bg-pink-100 text-pink-700 hover:bg-pink-200 transition"
        >
          利用規約
        </NuxtLink>
      </div>
    </div>
    <div class="border-t border-gray-700">
      <div class="container mx-auto px-4 py-6 text-center text-gray-500">
        &copy; 2025 Yosakoi Portal
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
const route = useRoute();
</script>
