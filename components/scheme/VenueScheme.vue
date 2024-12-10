<template>
  <div class="position-relative h-100">
    <SchemeZoomBlock
      v-if="schemeView === 'plan'"
      @scale="scale = $event"
      :scale="scale" />
    <div
      class="venue-wrapper pan-disabled"
      :class="`view-${view}`"
      v-if="schemeView === 'plan'"
      ref="venueWrapper">
      <n-popover
        v-if="view !== 'highlight-sections'"
        :show="!!sectionHovered?.id && !sectionHovered.entrance"
        :x="x"
        :y="y"
        trigger="manual"
        :animated="false">
        <span v-if="sectionHovered">
          {{
            numberOfTickets(sectionHovered.id) > 0
              ? `${$t('tickets_of')}: ${numberOfTickets(sectionHovered.id)}`
              : $t('no_tickets')
          }}
        </span>
      </n-popover>
      <svg
        class="venue-svg position-absolute w-100"
        id="venueSvg"
        ref="venueSvg"
        :style="`transform: scale(${scale}) translate(${
          scheme ? scheme.x : 0
        }px,${scheme ? scheme.y : 0}px)`"
        :class="{
          transitionTransform: zooming
        }"
        :viewBox="`0 0 ${scheme.width} ${scheme.height}`">
        <template v-for="(s, sind) in scheme.sections" :key="'path-' + sind">
          <SchemeSectionSvgCanvas
            @click="selectSector(sind, s)"
            :sec="s"
            @mouseenter="s.for_sale ? (sectionHovered = s) : ''"
            @mouseleave="sectionHovered = null"
            @mousemove="mousePosition"
            :class="{
              blocked: sectorIsBlocked(s) && s.for_sale,
              not_for_sale: !s.for_sale,
              closed: sectionIsClosed(s.id)
            }"
            :fill="getColorForSection(s)" />
        </template>
      </svg>
    </div>
    <div v-if="schemeView === 'list'" class="pb-5">
      <template v-for="(s, sind) in scheme.sections" :key="'sect-' + sind">
        <div class="section-row" v-if="s.for_sale">
          <div class="row align-items-center">
            <div class="col">
              <div class="section-title">{{ s.title.ru }}</div>
              <div class="text-muted">
                {{ $t('places_left') }}: {{ numberOfTickets(s.id) }}
              </div>
            </div>
            <div class="col-auto"></div>
            <div class="col-auto">
              <n-button
                type="primary"
                :disabled="sectorIsBlocked(s)"
                @click="selectSector(sind, s)">
                {{ $t('choose_seats') }}
              </n-button>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NButton, NPopover } from 'naive-ui'
import { useSchemeStore } from '~/stores/scheme.store'
import { storeToRefs } from 'pinia'
import { useShowStore } from '~/stores/show.store'

const props = defineProps({
  view: {
    type: String,
    default: 'user'
  },
  selectedPricegroups: {
    type: Array,
    default: () => []
  }
})

const schemeStore = useSchemeStore()
const showStore = useShowStore()

const { scheme, schemeView, pricegroups, section } = storeToRefs(schemeStore)
const { closedSections, ticketsSummary, isByPricegroups } =
  storeToRefs(showStore)

const sectionHovered = ref(null)
const scale = ref(1)
const zooming = ref(false)
const venueSvg: any = ref(null)
const x = ref(null)
const y = ref(null)

const sectorIsBlocked = (section: any) => {
  if (props.view === 'highlight-sections') return false
  return numberOfTickets(section.id) < 1
}

const numberOfTickets = (sectorId: number) => {
  if (isByPricegroups.value) return pricegroups.value?.[sectorId]?.cnt || 0
  return ticketsSummary.value?.[sectorId]?.cnt || 0
}

const selectSector = (index: number, pressedSector: any) => {
  if (props.view === 'highlight-sections') return
  if (sectorIsBlocked(pressedSector)) return
  if (props.view === 'user' && !pressedSector.for_sale) return
  section.value = section.value?.id === pressedSector.id ? null : pressedSector
}

const sectionIsClosed = (id: number) => {
  if (props.view !== 'admin') return false
  return !!closedSections.value.find((obj: any) => obj.section_id === id)
}

const mousePosition = (e: any) => {
  x.value = e.clientX
  y.value = e.clientY - 10
}

const getColorForSection = (section: any) => {
  if (props.view !== 'highlight-sections') return ''
  let color: string | null = null
  props.selectedPricegroups.forEach((pricegroup: any) => {
    pricegroup.sections.forEach((s: any) => {
      if (!color && s.id === section.id) {
        color = pricegroup.color
      }
    })
  })
  if (color) return color
  return 'rgba(0,0,0,0.1)'
}
</script>
