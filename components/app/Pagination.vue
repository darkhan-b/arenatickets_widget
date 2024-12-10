<template>
  <div v-if="pagination.pages > 1">
    <div class="mt-5">
      <n-pagination
        :page="page"
        class="justify-content-center"
        @update:page="$emit('pageChange', $event)"
        :page-count="pagination.pages" />
    </div>
  </div>
</template>

<script setup>
import { NPagination } from 'naive-ui'

defineProps({
  pagination: {
    type: Object,
    required: true
  },
  page: {
    type: Number,
    required: true
  }
})
</script>
