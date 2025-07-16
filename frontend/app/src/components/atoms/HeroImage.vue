<template>
  <section class="relative w-full h-64 md:h-[500px] overflow-hidden">
    <img :src="imageUrl" :alt="altText" class="w-full h-full object-cover" />
    <div
      class="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center"
    >
      <div class="text-center text-white">
        <h1 class="text-4xl md:text-6xl font-bold mb-4">{{ title }}</h1>
        <p class="text-lg md:text-xl">{{ subtitle }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  imageUrl: string;
  altText: string;
  title: string;
  subtitle: string;
}

withDefaults(defineProps<Props>(), {
  imageUrl: "https://i.ytimg.com/vi/wSs6ffKGcX4/maxresdefault.jpg",
  altText: "よさこい祭りの様子",
  title: "熱く踊れ、日本を彩れ。",
  subtitle: "全国のよさこい祭り情報をお届けします",
});
</script>
