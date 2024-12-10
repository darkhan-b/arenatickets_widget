<template>
  <n-breadcrumb>
    <n-breadcrumb-item>
      <NuxtLink to="/">{{ $t('home') }}</NuxtLink>
    </n-breadcrumb-item>
    <n-breadcrumb-item v-for="(i, ind) in items" :key="`item-${ind}`">
      <NuxtLink v-if="i.link" :to="i.link">{{ i.title }}</NuxtLink>
      <span v-else>{{ i.title }}</span>
    </n-breadcrumb-item>
  </n-breadcrumb>
</template>

<script setup>
import { NBreadcrumb, NBreadcrumbItem } from 'naive-ui'

defineProps({
  items: {
    type: Array,
    default: () => []
  }
})
</script>
