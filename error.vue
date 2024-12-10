<template>
  <n-message-provider>
    <NuxtLayout>
      <div class="container">
        <div class="row mt-5 align-items-center">
          <div class="col order-md-0 order-1">
            <h1>Упс, что-то пошло не так 😞</h1>
            <div v-if="statusCode === 404">
              <p class="text-muted">
                Мы не можем найти страницу, которую вы ищете
              </p>
            </div>
            <NuxtLink to="/" class="btn btn-themed d-inline-flex px-5 mt-4"
              >На главную</NuxtLink
            >
          </div>
          <div class="col-auto order-md-1 order-0">
            <div class="status-code">
              {{ statusCode }}
            </div>
          </div>
        </div>
      </div>
    </NuxtLayout>
  </n-message-provider>
</template>

<script setup>
import { NMessageProvider } from 'naive-ui'

const props = defineProps({
  error: Object
})

const statusCode = computed(() => {
  return Number(props.error.statusCode)
})
</script>

<style scoped>
.status-code {
  color: #f1f1f1;
  font-size: 200px;
  font-weight: bold;
}
@media screen and (max-width: 768px) {
  .status-code {
    font-size: 120px;
  }
}
</style>
