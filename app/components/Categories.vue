<template>
  <section class="max-w-7xl mx-auto px-6 py-8">
    
    <h2 class="text-2xl font-bold mb-6">Categories</h2>

    <div class="flex gap-4 overflow-x-auto pb-2">
      
    <NuxtLink
      v-for="category in categories"
      :key="category.id"
      :to="`/shop/category/${category.id}`"
      class="min-w-[120px] rounded-2xl shadow p-4 flex flex-col items-center cursor-pointer transition bg-white hover:bg-indigo-600 hover:text-white hover:shadow-md"
    >
      <p class="text-sm font-medium text-center">
        {{ category.name }}
      </p>
    </NuxtLink>

    </div>

  </section>
</template>

<script setup>
defineProps({
  categories: Object
})
import { ref, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'

const api = useApi()
const categories = ref([])
onMounted(async () => {
  try {
    categories.value = await api.category.getAll()
  } catch (error) {
    console.error('Failed to fetch category:', error)
  }
})


</script>