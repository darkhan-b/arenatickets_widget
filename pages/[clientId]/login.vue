<template>
  <div class="container">
    <n-form
      ref="formRef"
      class="narrow-form mt-5"
      :model="formData"
      :rules="rules">
      <n-space vertical :size="0">
        <n-form-item path="email" label="Email">
          <n-input
            placeholder="Email"
            step="10"
            class="input-gray"
            v-model:value="formData.email" />
        </n-form-item>
        <n-form-item path="name" :label="$t('password')">
          <n-input
            :placeholder="$t('password')"
            class="input-gray"
            type="password"
            step="10"
            v-model:value="formData.password" />
        </n-form-item>
        <n-form-item>
          <n-button type="primary" class="w-100" @click="login">{{
            $t('to_login')
          }}</n-button>
        </n-form-item>
      </n-space>
    </n-form>
  </div>
</template>

<script setup>
import { NForm, NFormItem, NInput, NSpace, NButton, useMessage } from 'naive-ui'
import { tokenService } from '~/utils/token.service'
const { $t } = useNuxtApp()
const formRef = ref(null)
const formData = reactive({
  email: '',
  password: ''
})
const message = useMessage()

const rules = {
  email: [
    { required: true, message: $t('field_is_required') },
    { type: 'email', message: $t('email_format_is_wrong') }
  ],
  password: [{ required: true, message: $t('field_is_required') }]
}

const login = async () => {
  const res = await useAPI(`auth/login`, {
    method: 'POST',
    body: JSON.stringify(formData)
  })
  const token = res?.data?.value?.data || null
  if (token?.token) {
    tokenService.saveToken(token.token)
    message.success(translate('success'))
  }
}
</script>

<style lang="scss" scoped>
.narrow-form {
  max-width: 320px;
  margin: 0 auto;
}
</style>
