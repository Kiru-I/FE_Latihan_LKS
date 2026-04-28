<template>
  <div class="max-w-7xl mx-auto px-6 py-12">
    <h1 class="text-3xl font-bold mb-8 text-center">  Category {{ category?.name || '' }}</h1>

    <!-- loading -->
    <div v-if="loading" class="text-center text-gray-500">
      Loading products...
    </div>

    <!-- empty -->
    <div v-else-if="products.length === 0" class="text-center text-gray-500">
      No products found.
    </div>

    <!-- ✅ use ProductCard -->
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '~/composables/useApi'
import ProductCard from '~/components/ProductCard.vue'

const route = useRoute()
const api = useApi()

const products = ref([])
const category = ref(null)
const loading = ref(false)

const fetchProducts = async () => {
  const categoryId = Number(route.params.id)

  if (!categoryId) return

  loading.value = true

  try {
    const res = await api.products.getByCategory(categoryId)

    products.value = res.products   // ✅ FIX
    category.value = res.category   // ✅ FIX
  } catch (err) {
    console.error('Failed to fetch products:', err)
  } finally {
    loading.value = false
  }
}

// ✅ better than onMounted + watch
watch(() => route.params.id, fetchProducts, { immediate: true })
</script>