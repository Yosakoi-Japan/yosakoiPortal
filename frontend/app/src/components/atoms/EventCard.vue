<template>
  <div 
    class="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200"
    @click="handleClick"
  >
    <h3 class="font-semibold text-lg mb-2">{{ title }}</h3>
    <p class="text-gray-600 mb-2">{{ period || "" }}</p>
    <p class="text-gray-600 mb-2">{{ area }}</p>
    <p class="text-gray-700">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
  area: string
  description: string
  period?: string
}>()

const emit = defineEmits<{
  click: [
    event: {
      title: string
      area: string
      description: string
      period?: string
    },
  ]
}>()

const handleClick = () => {
  emit('click', {
    title: props.title,
    area: props.area,
    description: props.description,
    period: props.period
  })
}
</script>
