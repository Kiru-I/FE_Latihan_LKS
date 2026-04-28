<template>
  <div class="max-w-4xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">Riwayat Pesanan</h1>

    <!-- Loading -->
    <div v-if="loading" class="text-gray-500 text-center">
      Loading...
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-red-500 text-center">
      Failed to load orders
    </div>

    <!-- Empty -->
    <div v-else-if="orders.length === 0" class="text-gray-500 text-center">
      Belum ada pesanan
    </div>

    <!-- Orders -->
    <div v-else class="space-y-4">
      <div
        v-for="order in orders"
        :key="order.id"
        class="bg-white shadow rounded-2xl p-4 flex justify-between items-center hover:shadow-md transition"
      >
        
        <!-- LEFT SIDE -->
        <div>
          <p class="font-semibold text-lg">
            Order #{{ order.id }}
          </p>

          <p class="text-sm text-gray-500">
            {{ formatDate(order.createdAt) }}
          </p>

          <p class="text-sm text-gray-500">
            Delivered: {{ order.estimate || '2-4 hari' }}
          </p>

          <p class="text-sm text-gray-700 mt-1">
            Total: ${{ formatPrice(order.totalPrice) }}
          </p>
        </div>

        <!-- RIGHT SIDE -->
        <div class="text-right flex flex-col items-end gap-2">
          
          <!-- Status -->
          <span
            class="px-3 py-1 rounded-full text-sm font-medium"
            :class="getStatusClass(order.status)"
          >
            {{ order.status || 'Pending' }}
          </span>

          <!-- View Button -->
          <button
            @click="goToDetail(order.id)"
            class="text-indigo-600 hover:underline text-sm"
          >
            View Order →
          </button>

        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from '~/composables/useApi'

const api = useApi()
const router = useRouter()

const orders = ref<any[]>([])
const loading = ref(true)
const error = ref(false)

// Fetch orders
const fetchOrders = async () => {
  try {
    const res = await api.order.getByUserId()
    orders.value = res
  } catch (err) {
    console.error(err)
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(fetchOrders)

// Format date
const formatDate = (date: string) => {
  return new Date(date).toLocaleString('id-ID')
}

// Format price
const formatPrice = (price: number) => {
  return Number(price).toLocaleString('id-ID')
}

// Status color
const getStatusClass = (status: string) => {
  switch (status) {
    case 'paid':
      return 'bg-green-100 text-green-600'
    case 'pending':
      return 'bg-yellow-100 text-yellow-600'
    case 'cancelled':
      return 'bg-red-100 text-red-600'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}

// Navigate to detail page
const goToDetail = (id: number) => {
  router.push(`/order/placed/${id}`)
}
</script>