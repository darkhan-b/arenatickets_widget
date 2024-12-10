<template>
  <g class="section" :class="{ selected: selected }">
    <g
      v-if="sec.svg.custom"
      class="section-transition_"
      :style="shadowStyle"
      v-html="fillCustomSvg(sec.svg.custom)"></g>
    <path
      v-else
      class="section-transition_"
      stroke="black"
      :style="shadowStyle"
      :stroke-width="selected ? '1' : '0'"
      :fill="fill ? fill : sec.svg.color"
      :d="'M' + sec.svg.points.join(' l') + 'z'"></path>
    <template v-if="sec.show_title">
      <text
        text-anchor="middle"
        v-for="(title, titleIndex) in sectionTitleArray"
        :key="titleIndex"
        dominant-baseline="central"
        :transform="`rotate(${sec.svg.text[2] ? sec.svg.text[2] : 0}, ${
          sec.svg.text[0]
        }, ${sec.svg.text[1]})`"
        :font-size="`${sec.svg.title_size || ''}`"
        :style="`fill: ${sec.svg.title_color || '#000'}`"
        :x="sec.svg.text[0]"
        :y="sec.svg.text[1] + (sec.svg.title_size || 14) * 1.1 * titleIndex">
        {{ title }}
      </text>
    </template>
    <slot />
  </g>
</template>

<script setup lang="ts">
import { useSchemeStore } from '@/stores/scheme.store'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

const props = defineProps({
  sec: {
    type: Object
  },
  fill: {
    type: String,
    default: ''
  }
})

const schemeStore = useSchemeStore()

const { section } = storeToRefs(schemeStore)

const selected = computed(() => {
  return section.value?.id === props.sec?.id
})

const shadowStyle = computed(() => {
  return selected.value
    ? // ? 'filter: drop-shadow(2px 4px 4px rgb(0 0 0 / 0.4))'
      ''
    : ''
})

const sectionTitleArray = computed(() => props.sec?.title?.ru?.split('|') || [])

const fillCustomSvg = (svgCode: string) => {
  if (!props.fill) return svgCode
  const fillRegex = /fill="[^"]*"/g
  return svgCode.replace(fillRegex, `fill="${props.fill}"`)
}
</script>

<style scoped>
.section-transition {
  transition: all 0.2s ease-in;
}
</style>
