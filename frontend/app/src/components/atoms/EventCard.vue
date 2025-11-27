<template>
  <div
    class="group relative flex h-full flex-col justify-between rounded-2xl bg-white p-6 text-left shadow-sm ring-1 ring-gray-100 transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:ring-red-200 cursor-pointer"
    role="button"
    tabindex="0"
    :aria-label="`${title}の詳細を見る`"
    @click="handleClick"
    @keydown="handleKeyDown"
  >
    <div>
      <h3 class="text-xl font-bold text-gray-900">
        {{ title }}
      </h3>

      <div class="mt-4 flex flex-wrap gap-3 text-sm">
        <span
          v-if="period"
          class="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 font-medium text-red-600"
        >
          <svg
            class="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          {{ period }}
        </span>

        <span class="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 font-medium text-gray-700">
          <svg
            class="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19.5 10.5c0 7.5-7.5 11-7.5 11s-7.5-3.5-7.5-11a7.5 7.5 0 0115 0z"
            />
          </svg>
          {{ area }}
        </span>
      </div>

      <p class="mt-4 text-sm leading-relaxed text-gray-600 clamp-3">
        {{ description }}
      </p>
    </div>

    <div class="mt-6 flex items-center gap-2 text-sm font-semibold text-red-500">
      <span>詳細ページへ</span>
      <svg
        class="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 5l7 7-7 7"
        />
      </svg>
    </div>
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

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    handleClick()
  }
}
</script>

<style scoped>
.clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
