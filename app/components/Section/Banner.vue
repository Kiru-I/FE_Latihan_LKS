<template>
  <section class="bg-linear-to-r from-indigo-600 to-purple-600 text-white">
    <div class="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-10">
      
      <div class="max-w-lg">
        <h2 class="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          {{ title }}
        </h2>
        <p class="text-lg opacity-90 mb-6">
          {{ subtitle }}
        </p>
         <NuxtLink to="/shop" class="bg-white text-indigo-600 px-6 py-3 rounded-2xl font-semibold hover:scale-105 transition">
          {{ buttonText }}
        </NuxtLink>
      </div>
      <NuxtLink :to="`/product/${id}`">
      <div class="w-100 h-75 overflow-hidden rounded-xl shrink-0">
        <img 
          :src="heroImage"
          class="w-full h-full object-cover block"
        />
      </div>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'

const api = useApi()

const heroImage = ref('') // ✅ local stat
const id = ref()

onMounted(async () => {
  try {
    const res = await api.products.getAll(1, 1)

    if (res.data.length > 0) {
      heroImage.value = res.data[0].imageUrl
      id.value = res.data[0].id
    }
  } catch (error) {
    console.error('Failed to fetch products:', error)
  }
})

defineProps({
  title: {
    type: String,
    default: "Big Sale Up To 50% Off"
  },
  subtitle: {
    type: String,
    default: "Don't miss out on our biggest discounts of the year."
  },
  buttonText: {
    type: String,
    default: "Shop Now"
  }
})
</script>