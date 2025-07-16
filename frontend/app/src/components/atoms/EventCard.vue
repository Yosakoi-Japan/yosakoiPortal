<template>
  <div 
    class="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200"
    @click="handleClick"
  >
    <h3 class="font-semibold text-lg mb-2">{{ title }}</h3>
    <p class="text-gray-600 mb-2">{{ startDate }}〜{{ endDate }}</p>
    <p class="text-gray-600 mb-2">{{ area }}</p>
    <p class="text-gray-700">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
  startDate: string
  endDate: string
  area: string
  description: string
}>()

const emit = defineEmits<{
  click: [event: { title: string; startDate: string; endDate: string; area: string; description: string }]
}>()

const handleClick = () => {
  emit('click', {
    title: props.title,
    startDate: props.startDate,
    endDate: props.endDate,
    area: props.area,
    description: props.description
  })
}
</script>
