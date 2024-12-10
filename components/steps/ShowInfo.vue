<template>
  <div v-if="show">
    <h1>
      {{ trans(show.title) }}
    </h1>
    <div v-if="show">
      <n-space
        :size="8"
        align="center"
        :justify="isMobile ? 'start' : 'center'">
        <span :class="{ 'text-muted': isMobile }">
          {{ formatDateTime(timetable.date) }}
        </span>
        <SharedSpot :color="isMobile ? '#828282' : '#fff'" />
        <span :class="{ 'text-muted': isMobile }">
          {{ show.placeString }}
        </span>
      </n-space>
    </div>
  </div>
</template>

<script setup>
import { useShowStore } from '~/stores/show.store'
import { storeToRefs } from 'pinia'
import { NSpace } from 'naive-ui'
import { useGeneralStore } from '~/stores/general.store'
import { formatDateTime } from '~/utils/helpers'

const showStore = useShowStore()
const generalStore = useGeneralStore()

const { show, timetable } = storeToRefs(showStore)
const { isMobile } = storeToRefs(generalStore)
</script>
