<template>
  <section class="relative h-48 w-full shrink-0 overflow-hidden sm:h-64 md:h-[360px]">
    <picture class="block w-full h-full">
      <source media="(min-width: 768px)" :srcset="desktopImageUrl" />
      <img :src="imageUrl" :alt="altText" class="w-full h-full object-cover" />
    </picture>
    <div
      class="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center"
    >
      <div class="text-center text-white">
        <h1 class="mb-2 whitespace-nowrap text-[clamp(1.25rem,7vw,3.75rem)] font-bold leading-none md:mb-4">{{ title }}</h1>
        <p class="whitespace-nowrap text-[clamp(0.75rem,4.5vw,1.25rem)] leading-none">{{ subtitle }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  imageUrl?: string;
  desktopImageUrl?: string;
  altText?: string;
  title?: string;
  subtitle?: string;
}

withDefaults(defineProps<Props>(), {
  imageUrl: "/top_image.png",
  desktopImageUrl: "/top_image_desktop.png",
  altText: "よさこい祭りの様子",
  title: "熱く踊れ、日本を彩れ。",
  subtitle: "全国のよさこい祭り情報をお届けします",
});
</script>
