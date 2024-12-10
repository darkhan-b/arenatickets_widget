<template>
  <div class="zoom-block">
    <a @click="zoomIn">
      <n-icon :size="23" :component="AddOutline"></n-icon>
    </a>
    <a @click="zoomOut">
      <n-icon :size="23" :component="RemoveOutline"></n-icon>
    </a>
  </div>
</template>

<script lang="ts" setup>
import { NIcon } from 'naive-ui'
import { AddOutline, RemoveOutline } from '@vicons/ionicons5'

const emit = defineEmits(['scale'])

const props = defineProps({
  maxScale: {
    type: Number,
    default: 3
  },
  minScale: {
    type: Number,
    default: 0.2
  },
  step: {
    type: Number,
    default: 0.1
  },
  scale: {
    type: Number,
    default: 1
  }
})
const zoomIn = () => {
  const scale = Math.min(props.maxScale, props.scale + props.step)
  emit('scale', scale)
}

const zoomOut = () => {
  const scale = Math.max(props.minScale, props.scale - props.step)
  emit('scale', scale)
}
</script>

<style scoped lang="scss">
.zoom-block {
  position: absolute;
  z-index: 10;
  right: 10px;
  top: 15px;
  display: flex;
  flex-direction: column;
  > a {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 5px;
    touch-action: manipulation;
    //@include roundBtn(40px);
    width: 52px;
    height: 52px;
    border-radius: 100%;
    box-shadow: 0px 2px 10px rgba(82, 87, 101, 0.2);
    background: #fff;
    cursor: pointer;
    &:hover {
      fill: $color-primary;
    }
    &:focus,
    &:active {
      transform: scale(0.9);
    }
  }
}
@media screen and (max-width: 768px) {
  .zoom-block {
    bottom: 10px;
    flex-direction: row-reverse;
    right: 50%;
    top: auto;
    transform: translateX(50%);
  }
}
</style>
