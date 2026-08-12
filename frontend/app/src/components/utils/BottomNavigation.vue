<script setup lang="ts">
const route = useRoute();

const navigationItems = [
  { label: "ホーム", to: "/", icon: "home" },
  { label: "地図", to: "/map", icon: "map" },
] as const;

const isActive = (to: string) =>
  to === "/" ? route.path === "/" : route.path.startsWith(to);
</script>

<template>
  <nav
    class="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_18px_rgba(15,23,42,0.08)] backdrop-blur md:hidden"
    aria-label="メインナビゲーション"
  >
    <div class="mx-auto grid h-[4.5rem] max-w-md grid-cols-2">
      <NuxtLink
        v-for="item in navigationItems"
        :key="item.to"
        :to="item.to"
        class="flex min-w-0 flex-col items-center justify-center gap-1 text-xs font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-orange-500"
        :class="isActive(item.to) ? 'text-orange-500' : 'text-slate-500 hover:text-orange-500'"
        :aria-current="isActive(item.to) ? 'page' : undefined"
      >
        <svg
          v-if="item.icon === 'home'"
          class="h-7 w-7"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.25"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10Z" />
        </svg>
        <svg
          v-else
          class="h-7 w-7"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="m9 18-6 3V6l6-3 6 3 6-3v15l-6 3-6-3Z" />
          <path stroke-linecap="round" d="M9 3v15m6-12v15" />
        </svg>
        <span>{{ item.label }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>
