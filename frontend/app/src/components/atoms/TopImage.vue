<template>
  <section class="relative aspect-[2.4] w-full shrink-0 overflow-hidden sm:aspect-[8/3]">
    <img
      :src="imageUrl"
      :alt="altText"
      class="h-full w-full object-cover object-center sm:object-contain"
    />
    <div class="sr-only">
      <h1>{{ title }}</h1>
      <p>{{ subtitle }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  imageUrl?: string;
  altText?: string;
  title?: string;
  subtitle?: string;
}

withDefaults(defineProps<Props>(), {
  imageUrl: "/top_image.png",
  altText: "鳴子を手に熱く踊るよさこいの踊り手たち",
  title: "熱く踊れ、日本を彩れ。",
  subtitle: "全国のよさこい祭り情報をお届けします",
});
</script>
