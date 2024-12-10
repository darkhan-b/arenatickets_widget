<template>
  <div class="container px-0 position-relative bg-white">
    <div class="d-flex flex-column vh-100 main-part">
      <AppHeader />
      <div class="d-flex flex-grow-1">
        <section
          class="body-content"
          :class="{ 'overflow-hidden': isMobile && section }">
          <StepsShowInfo v-if="isMobile" class="mb-4" />
          <slot @validated="validated" />
        </section>
        <StepsCart ref="cartRef" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useMessage } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { useGeneralStore } from '~/stores/general.store'
import { useCartStore } from '~/stores/cart.store'
import { useSchemeStore } from '~/stores/scheme.store'
import { tokenService } from '~/utils/token.service'

const route = useRoute()
const generalStore = useGeneralStore()
const cartStore = useCartStore()
const schemeStore = useSchemeStore()

const { clientId, isMobile, user, permissions, settings, translations } =
  storeToRefs(generalStore)
const { cart } = storeToRefs(cartStore)
const { section } = storeToRefs(schemeStore)
const cartRef = ref(null)

clientId.value = route.params?.clientId || null

onMounted(() => {
  window.$message = useMessage()
  window.addEventListener('resize', (e) => {
    isMobile.value = window.innerWidth <= 768
  })
  isMobile.value = window.innerWidth <= 768
})

const validated = () => {
  cartRef.value.fillOrder()
}

const oneTimeToken = route.query.otkn
const lang = route.query.lang
if (['ru', 'en', 'kz'].includes(lang)) {
  generalStore.setLang(lang)
}
const showId = route.params.showId || ''
const orderId = route.params.orderId || ''

if (oneTimeToken) {
  try {
    const res = await useAPI('token/auth', {
      method: 'POST',
      body: {
        token: oneTimeToken
      }
    })
    if (res?.data?.value?.data) {
      tokenService.saveToken(res?.data?.value?.data)
    }
  } catch (e) {
    console.log(e)
  }
}

const { data } = await useAPI(
  `widget/settings?show_id=${showId}&order_id=${orderId}`
)
const parsed = data.value.data
user.value = parsed?.user || null
permissions.value = (parsed?.showRights || []).concat(
  parsed?.user?.permissionsList || []
)
settings.value = parsed?.settings || {}
translations.value = parsed?.translations || {}
</script>
