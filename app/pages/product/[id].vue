<template>
  <div class="max-w-4xl mx-auto p-6">
    <div v-if="pending" class="text-gray-500">Loading...</div>

    <div v-else-if="error" class="text-red-500">
      Failed to load product.
    </div>

    <div v-else-if="product" class="grid md:grid-cols-2 gap-8">
      <img
        :src="product.imageUrl"
        class="w-full h-80 object-cover rounded-2xl shadow"
      />

      <div>
        <h1 class="text-3xl font-bold mb-2">{{ product.name }}</h1>
        <h2 class="text-1xl font-bold mb-2">{{ product.categoryName }}</h2>
        <p class="text-2xl text-gray-500 mb-4">${{ product.price }}</p>
        <h2 class="text-1xl font-bold mb-2">Description</h2>
        <p class="text-gray-700 mb-6">
          {{ product.description || "No description available." }}
        </p>

        <button
          :disabled="loading"
          class="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition"
          @click.prevent="addToCart(Number(route.params.id))"
        >
          {{ loading ? "Adding..." : "Add to Cart" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useToast } from 'vue-toastification'
import { useApi } from '~/composables/useApi'
import { useCart } from '~/composables/useCart'

const { addToCart, loading } = useCart()
const toast = useToast()
const route = useRoute()
const api = useApi()

const product = ref()
const pending = ref(false)
const error = ref()

const fetchProduct = async () => {
  const id = Number(route.params.id)

  if (!id) {
    product.value = null
    return
  }

  pending.value = true
  error.value = null

  try {
    product.value = await api.products.getById(id)
  } catch (err) {
    console.error(err)
    error.value = err
    product.value = null
  } finally {
    pending.value = false
  }
}

// ✅ run immediately AND on route change
watch(
  () => route.params.id,
  fetchProduct,
  { immediate: true } // 🔥 replaces onMounted
)
</script>