<template>
  <span class="bubble" :style="`background: ${color};`"></span>
</template>

<script setup>
defineProps({
  color: {
    type: String,
    default: '#fff'
  }
})
</script>

<style scoped lang="scss">
.bubble {
  display: inline-block;
  vertical-align: middle;
  @include roundBtn(3px);
}
</style>
