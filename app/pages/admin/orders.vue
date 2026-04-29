<template>
  <div>
    <h2 class="text-2xl font-semibold mb-4">Manage Orders</h2>

    <div class="bg-white p-4 rounded-xl shadow">
      <div class="relative inline-block">
  <button
    @click="open = !open"
    class="px-3 py-1 bg-gray-100 rounded mb-2"
  >
    Sort By : {{ selected.label }}
  </button>

  <div
    v-if="open"
    class="absolute mt-2 w-40 bg-white border rounded shadow"
  >
  <div
    v-for="item in options"
    :key="item.value"
    @click="selectOption(item)"
    class="px-3 py-1"
  >
    {{ item.label }}
  </div>
  </div>
</div>
      <div
        v-for="order in orders"
        :key="order.id"
        class="bg-white shadow rounded-2xl p-4 mb-2 flex justify-between items-center hover:shadow-md transition"
      >
        
        <!-- LEFT SIDE -->
        <div>
          <p class="font-semibold text-lg">
            Order #{{ order.id }}
          </p>


          <p class="text-md text-gray-900">
            Ordered by : {{ order.name}}
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
          <select
            v-model="order.status"
            @change="updateStatus(order)"
            class="px-3 py-1 rounded-full text-sm font-medium"
            :class="getStatusClass(order.status)"
          ><div class="absolute mt-2 w-40 bg-white border rounded shadow">
            <option class="bg-white text-black " value="pending">Pending</option>
            <option class="bg-white text-black" value="paid">Paid</option>
            <option class="bg-white text-black" value="shipped">Shipped</option>
            <option class="bg-white text-black" value="delivered">Delivered</option>
            </div>
          </select>

          <!-- View Button -->
          <button
            @click="goToDetail(order.id)"
            class="mt-2 w-40 bg-white border rounded shadow text-indigo-600 hover:underline text-sm"
          >
            View Detail
          </button>
          <button
          @click="deleteOrder(order.id)"
          class="mt-2 w-40 bg-white border rounded shadow text-red-600 hover:underline text-sm"
          >
            Delete Order
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

import { ref, onMounted } from 'vue'
import { useRouter } from '#imports'
import { useApi } from '~/composables/useApi'
import { useToast } from 'vue-toastification'

/* ---------------- COMPOSABLES ---------------- */

const api = useApi()
const router = useRouter()
const toast = useToast()

/* ---------------- STATE ---------------- */

const orders = ref<any[]>([])
const loading = ref(true)
const error = ref(false)
const changeopen = ref(false)
const open = ref(false)

type OrderStatus = "pending" | "paid" | "shipped" | "delivered"

type StatusOption = {
  label: string
  value: OrderStatus | "all"
}

const options: StatusOption[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Paid", value: "paid" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" }
]

// ✅ FIX: avoid undefined issue
const selected = ref<StatusOption>(options[0]!)

/* ---------------- API ---------------- */

// Fetch all orders
const fetchOrders = async () => {
  loading.value = true
  try {
    const res = await api.order.getAll()
    orders.value = res
  } catch (err) {
    console.error(err)
    error.value = true
  } finally {
    loading.value = false
  }
}

// Handle dropdown selection (server-side filtering)
const selectOption = async (option: StatusOption) => {
  selected.value = option
  open.value = false

  loading.value = true
  try {
    if (option.value === "all") {
      await fetchOrders()
    } else {
      const res = await api.order.getByStatus(option.value)
      orders.value = res
    }
  } catch (err) {
    console.error(err)
    toast.error('Failed to fetch orders')
  } finally {
    loading.value = false
  }
}

const updateStatus = async (order: any) => {
  try {
    await api.order.updateStatus(order.id, order.status)
    toast.success('Status updated')
  } catch (err) {
    console.error(err)
    toast.error('Failed to update status')
  }
}
/* ---------------- LIFECYCLE ---------------- */

onMounted(() => {
  fetchOrders()
})

/* ---------------- HELPERS ---------------- */

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

const formatPrice = (price: number) => {
  return price.toLocaleString()
}

const formatStatus = (status?: string) => {
  if (!status) return "Pending"
  return status.charAt(0).toUpperCase() + status.slice(1)
}

const getStatusClass = (status?: string) => {
  switch (status) {
    case 'delivered':
      return 'bg-green-100 text-green-700'
    case 'paid':
      return 'bg-blue-100 text-blue-700'
    case 'shipped':
      return 'bg-purple-100 text-purple-700'
    case 'pending':
      return 'bg-yellow-100 text-yellow-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

/* ---------------- ACTIONS ---------------- */

const goToDetail = (id: number) => {
  router.push(`/order/placed/${id}`)
}

const deleteOrder = async (id: number) => {
  if (!confirm("Remove this order?")) return

  try {
    const res = await api.order.delete(id)
    orders.value = orders.value.filter(order => order.id !== id)
    toast.success(res.message ?? 'Order removed')
  } catch (err: any) {
    console.error(err)
    toast.error(err?.data?.error ?? 'Failed to remove order')
  }
}
</script>