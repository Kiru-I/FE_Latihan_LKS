<template>
  <div class="max-w-7xl mx-auto px-6 py-12">
    <h1 class="text-3xl font-bold mb-8 text-center">Our Products</h1>

    <!-- loading -->
    <div v-if="loading" class="text-center text-gray-500">
      Loading products...
    </div>

    <!-- empty -->
    <div v-else-if="filteredProducts.length === 0" class="text-center text-gray-500">
      No products found.
    </div>

    <!-- ✅ use ProductCard -->
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      <ProductCard
        v-for="product in filteredProducts"
        :key="product.id"
        :product="product"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '~/composables/useApi'
import ProductCard from '~/components/ProductCard.vue' // ✅ import component

const route = useRoute()
const api = useApi()

const products = ref([])
const filteredProducts = ref([])
const loading = ref(true)
const searchQuery = ref('')


const fetchProducts = async (q = '') => {
  loading.value = true
  try {
    if (q.trim() === '') {
        const res = await api.products.getAll()
        products.value = res.data
    } else {
       products.value = await api.products.search(q)
    }

    filteredProducts.value = products.value
  } catch (err) {
    console.error('Failed to fetch products:', err)
  } finally {
    loading.value = false
  }
}

// On mount
onMounted(() => {
  const q = route.query.q || ''
  searchQuery.value = q.toString()
  fetchProducts(searchQuery.value)
})

// Watch query changes
watch(
  () => route.query.q,
  (newQ) => {
    searchQuery.value = newQ?.toString() || ''
    fetchProducts(searchQuery.value)
  }
)
</script>