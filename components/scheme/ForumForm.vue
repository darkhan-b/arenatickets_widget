<template>
  <div class="registration-form">
    <h2 class="form-title">Регистрация на Форум</h2>
    <form @submit.prevent="handleSubmit" class="form-container">
      <div class="form-field">
        <label for="fullname">ФИО</label>
        <input
          id="fullname"
          type="text"
          v-model="form.fullname"
          placeholder="Введите ваше ФИО"
          required />
      </div>

      <div class="form-field">
        <label for="email">Электронная почта</label>
        <input
          id="email"
          type="email"
          v-model="form.email"
          placeholder="Введите вашу почту"
          required />
      </div>

      <div class="form-field">
        <label for="phone">Контактный номер телефона</label>
        <input
          id="phone"
          type="tel"
          v-model="form.phone"
          placeholder="Введите ваш номер телефона"
          required />
      </div>

      <div class="form-field">
        <label for="company">Название компании/организации</label>
        <input
          id="company"
          type="text"
          v-model="form.company"
          placeholder="Введите название компании"
          required />
      </div>

      <div class="form-field">
        <label for="position">Должность</label>
        <input
          id="position"
          type="text"
          v-model="form.position"
          placeholder="Введите вашу должность"
          required />
      </div>

      <div class="form-field">
        <label for="country">Страна</label>
        <input
          id="country"
          type="text"
          v-model="form.country"
          placeholder="Введите вашу страну"
          required />
      </div>

      <div class="form-field">
        <label for="participation">Тип участия</label>
        <select id="participation" v-model="form.participation" required>
          <option disabled value="">Выберите тип участия</option>
          <option value="visitor">Посетитель</option>
          <option value="speaker">Спикер</option>
          <option value="exhibitor">Участник выставки</option>
        </select>
      </div>

      <div class="form-field">
        <label for="source">Источник информации о форуме</label>
        <input
          id="source"
          type="text"
          v-model="form.source"
          placeholder="Укажите, откуда узнали о форуме"
          required />
      </div>

      <div class="form-field">
        <label>
          <input type="checkbox" v-model="form.consent" required />
          Согласие с обработкой персональных данных
        </label>
      </div>

      <div class="form-actions">
        <button
          type="submit"
          class="submit-button"
          :disabled="loading || (order && orderSecondsLeft <= 0)">
          Зарегистрироваться
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCartStore } from '~/stores/cart.store'
import { storeToRefs } from 'pinia'
import { useDialog } from 'naive-ui'
import { useRouter } from 'vue-router'
import { useShowStore } from '~/stores/show.store'

const cartStore = useCartStore()
const showStore = useShowStore()
const dialog = useDialog()
const router = useRouter()

const form = ref({
  fullname: '',
  email: '',
  phone: '',
  company: '',
  position: '',
  country: '',
  participation: '',
  source: '',
  consent: false
})

const { cart, order, orderSecondsLeft } = storeToRefs(cartStore)
const { pricegroups } = storeToRefs(showStore)
console.log(pricegroups)
const loading = ref(false)
const conditionsAccepted = ref(false)

const pricegroupsArray = computed(() => {
  return Object.values(pricegroups.value).map((obj) => obj.pricegroup)
})

const defaultCartItem = computed(() => {
  const firstPricegroup = pricegroupsArray.value[0] || {}
  return {
    price: 0,
    pricegroup_id: firstPricegroup.id || 407,
    pricegroup_name: firstPricegroup.name || 'Входной'
  }
})

const updateCart = (sign) => {
  if (sign === '+') {
    const ticket = defaultCartItem.value
    cartStore.updateCart({ sign, ticket })
  }
}

const initOrder = async () => {
  loading.value = true
  try {
    const res = await cartStore.generateOrder({
      cart: cart.value,
      timetable_id: pricegroups.id,
      is_refundable: 1
    })

    if (res?.order?.id && res?.order?.hash) {
      return res.order
    } else {
      dialog.error({
        title: 'Ошибка',
        content: 'Ошибка при создании заказа: отсутствуют id или hash',
        positiveText: 'Ок'
      })
      return null
    }
  } catch (error) {
    dialog.error({
      title: 'Ошибка',
      content: error.message || 'Произошла ошибка при создании заказа',
      positiveText: 'Ок'
    })
    return null
  } finally {
    loading.value = false
  }
}

const fillOrder = async (order) => {
  if (!order?.id || !order?.hash) {
    dialog.error({
      title: 'Ошибка',
      content: 'Некорректные данные заказа (id или hash отсутствуют)',
      positiveText: 'Ок'
    })
    return
  }

  const payload = {
    name: form.value.fullname,
    email: form.value.email,
    phone: form.value.phone,
    pay_system: 'forum',
    comment: '',
    show_to_organizer: true,
    pay_system_imitated: null,
    promocode: '',
    timetable_id: order.timetable_id,
    company: form.value.company,
    position: form.value.position,
    country: form.value.country,
    participation: form.value.participation,
    source: form.value.source
  }

  try {
    loading.value = true

    const { data, error } = await useAPI(
      `/order/${order.id}/${order.hash}/fill`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: payload
      }
    )

    if (error.value) {
      throw new Error(
        error.value.message || 'Произошла ошибка при отправке заказа'
      )
    }

    if (data.value?.redirect) {
      location.href = data.value.redirect
    }
  } catch (error) {
    dialog.error({
      title: 'Ошибка',
      content: error.message || 'Произошла ошибка при отправке заказа',
      positiveText: 'Ок'
    })
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  updateCart('+')
  let createdOrder = order.value

  if (!createdOrder) {
    createdOrder = await initOrder()
  }

  if (createdOrder) {
    await fillOrder(createdOrder)
  } else {
    dialog.error({
      title: 'Ошибка',
      content: 'Не удалось создать заказ',
      positiveText: 'Ок'
    })
  }
}
</script>

<style scoped>
.registration-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
}

.form-title {
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-field {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 5px;
  font-size: 14px;
  color: #555;
}

input,
select {
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

input:focus,
select:focus {
  outline: none;
  border-color: #007aff;
  box-shadow: 0 0 4px rgba(0, 122, 255, 0.5);
}

.submit-button {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  color: #fff;
  background-color: #007aff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #0056b3;
}
</style>
