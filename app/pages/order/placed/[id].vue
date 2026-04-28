<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 p-6">
    <div class="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
      
      <!-- Icon -->
      <div class="text-green-500 text-5xl mb-4">✔</div>

      <!-- Title -->
      <h1 class="text-2xl font-bold mb-2">
        Pesanan anda berhasil ditempatkan!
      </h1>

        <div v-if="loading" class="text-center text-gray-500">
        Loading...
        </div>

        <div v-else-if="error" class="text-center text-red-500">
        Failed to load order.
        </div>

        <div v-else-if="order">
        <div class="text-left mt-6 space-y-2 text-gray-700">
            <p><strong>Nomor Pesanan:</strong> {{ order.id }}</p>
            <p><strong>Tanggal:</strong> {{ formatDate(order.createdAt) }}</p>
            <p><strong>Total:</strong> ${{ formatPrice(order.totalPrice) }}</p>
            <p><strong>Metode Pembayaran:</strong> {{ order.payment }}</p>
            <p><strong>Estimasi Pengiriman:</strong> {{ order.estimate || "2 - 4 Hari"}}</p>
        </div>
        </div>
      <!-- Buttons -->
      <div class="mt-6 flex flex-col gap-3">
        <button
          @click="goToOrders"
          class="w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700"
        >
          Lihat Riwayat Pesanan
        </button>

        <button
          @click="goHome"
          class="w-full border py-2 rounded-xl hover:bg-gray-100"
        >
          Kembali ke Beranda
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useApi } from '~/composables/useApi'

const router = useRouter()
const route = useRoute()
const api = useApi()

const order = ref<any>(null)
const loading = ref(true)
const error = ref(false)

const fetchOrder = async () => {
  const id = Number(route.params.id)

  if (!id) {
    error.value = true
    loading.value = false
    return
  }

  try {
    const res = await api.order.getById(id)
    order.value = res // ✅ from API
  } catch (err) {
    console.error(err)
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(fetchOrder)

// Format helpers
const formatDate = (date: string) => {
  return new Date(date).toLocaleString('id-ID')
}

const formatPrice = (price: number) => {
  return Number(price).toLocaleString('id-ID')
}

// Navigation
const goHome = () => router.push('/')
const goToOrders = () => router.push('/order')
</script>