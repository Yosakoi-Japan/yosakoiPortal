<script setup lang="ts">
import { ref } from "vue";

type MenuItem = {
  label: string;
  to?: string;
  href?: string;
  hasChildren?: boolean;
};

const menuItems: MenuItem[] = [
  { label: "ホーム", to: "/" },
  { label: "楽しみ方", to: "/guide" },
];

const isMenuOpen = ref(false);

const toggleMenu = (): void => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = (): void => {
  isMenuOpen.value = false;
};
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isMenuOpen"
      class="fixed inset-0 z-30 bg-gray-900/20 backdrop-blur-sm transition md:hidden"
      @click="closeMenu"
    />
  </Teleport>

  <header
    class="sticky top-0 z-40 border-b border-gray-200 bg-white/95 text-gray-900 backdrop-blur-xl shadow-sm"
  >
    <div
      class="container mx-auto flex items-center justify-between gap-4 px-4 py-3"
    >
      <NuxtLink
        to="/"
        class="text-xl font-semibold tracking-tight text-gray-900"
      >
        Yosakoi Portal
      </NuxtLink>

      <nav class="hidden items-center gap-6 text-sm font-medium md:flex">
        <template v-for="item in menuItems" :key="item.label">
          <NuxtLink
            v-if="item.to"
            :to="item.to"
            class="text-gray-600 transition hover:text-gray-900"
          >
            {{ item.label }}
          </NuxtLink>
          <a
            v-else
            :href="item.href ?? '#'"
            class="text-gray-600 transition hover:text-gray-900"
          >
            {{ item.label }}
          </a>
        </template>
      </nav>

      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 md:hidden"
        :aria-expanded="isMenuOpen"
        aria-controls="mobile-navigation"
        @click="toggleMenu"
      >
        <span>メニュー</span>
        <span
          class="text-lg leading-none transition-transform duration-200"
          :class="{ 'rotate-180': isMenuOpen }"
          aria-hidden="true"
        >
          ^
        </span>
      </button>
    </div>
  </header>

  <Transition name="fade-slide">
    <div
      v-if="isMenuOpen"
      id="mobile-navigation"
      class="md:hidden fixed inset-x-0 top-20 z-40 flex justify-center px-4"
    >
      <div
        class="w-full max-w-xs rounded-3xl bg-white/95 text-gray-900 shadow-2xl ring-1 ring-gray-200"
      >
        <ul class="divide-y divide-gray-100 py-2">
          <li v-for="item in menuItems" :key="item.label">
            <NuxtLink
              v-if="item.to"
              :to="item.to"
              class="flex items-center justify-between px-5 py-3 text-base font-medium text-gray-800 transition hover:bg-gray-50"
              @click="closeMenu"
            >
              <span>{{ item.label }}</span>
              <span
                v-if="item.hasChildren"
                class="text-gray-400 text-sm"
                aria-hidden="true"
                >></span
              >
            </NuxtLink>
            <a
              v-else
              :href="item.href ?? '#'"
              class="flex items-center justify-between px-5 py-3 text-base font-medium text-gray-800 transition hover:bg-gray-50"
              @click="closeMenu"
            >
              <span>{{ item.label }}</span>
              <span
                v-if="item.hasChildren"
                class="text-gray-400 text-sm"
                aria-hidden="true"
                >></span
              >
            </a>
          </li>
        </ul>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
