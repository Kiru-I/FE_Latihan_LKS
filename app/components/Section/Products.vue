<template>
    <section class="max-w-7xl mx-auto px-6 py-12">
      <h2 class="text-2xl font-bold mb-6">Featured Products</h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <ProductCard 
          v-for="product in products" 
          :key="product.id" 
          :product="product" 
        />
      </div>
    </section>
</template>

<script setup>
import { ref, onMounted } from  'vue'
import { useApi } from '~/composables/useApi'

const api = useApi()
const products = ref([])

onMounted(async () => {
  try {
    const res = await api.products.getAll(1, 4)
    products.value = res.data
  } catch (error) {
    console.error('Failed to fetch products:', error)
  }
})
</script>