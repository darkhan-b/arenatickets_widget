<template>
  <n-config-provider
    :theme-overrides="themeOverrides"
    :locale="ruRU"
    :date-locale="dateRuRU">
    <n-message-provider>
      <n-dialog-provider>
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup>
import {
  NConfigProvider,
  ruRU,
  dateRuRU,
  NMessageProvider,
  NDialogProvider
} from 'naive-ui'
import themeOverrides from '~/assets/themeOverrides'
</script>
