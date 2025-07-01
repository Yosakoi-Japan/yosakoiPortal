<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h3 class="font-semibold text-lg mb-2">{{ title }}</h3>
    <p class="text-gray-600 mb-2">{{ startDate }}〜{{ endDate }}</p>
    <p class="text-gray-600 mb-2">{{ area }}</p>
    <p class="text-gray-700">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  startDate: string
  endDate: string
  area: string
  description: string
}>()
</script>
