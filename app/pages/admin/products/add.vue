<template>
    <div>
        <h2 class="text-2xl font-semibold mb-4">Manage Products</h2>
        <div class="bg-white shadow rounded-2xl overflow-hidden p-10">
        <h2 class="text-xl font-semibold mb-4">Add Product</h2>
                <div class="bg-gray-50 shadow rounded-2xl overflow-hidden p-2">
      <form @submit.prevent="handleSubmit">
        <input
          v-model="name"
          type="text"
          placeholder="Name"
          class="bg-gray-50 text-gray-600 w-full p-2 mb-3 border rounded text-sm"
        />
        <input
          v-model="stock"
          type="number"
          placeholder="Stock"
          class="bg-gray-50 text-gray-600 w-full p-2 mb-3 border rounded text-sm"
        />
        <input
          v-model="price"
          type="number"
          placeholder="Price"
          class="bg-gray-50 text-gray-600 w-full p-2 mb-3 border rounded text-sm"
        />
        <input
          v-model="description"
          type="text"
          placeholder="Description"
          class="bg-gray-50 text-gray-600 w-full p-2 mb-3 border rounded text-sm"
        />
        <input
            type="file"
            @change="handleImageChange"
            class="bg-gray-50 text-gray-600 w-full p-2 mb-3 border rounded text-sm"
        />

        <select
          v-model="categoryId"
          class="bg-gray-50 text-gray-600 w-full p-2 mb-3 border rounded text-sm"
            placeholder="Category"
          >
          <option value=null disabled>Select category</option>
          <option 
            v-for="cat in categories" 
            :key="cat.id" 
            :value="cat.id"
          >
            {{ cat.name }}
          </option>
        </select>

        <button type="submit" class="w-full bg-indigo-600 text-white py-2 rounded">
            Add Product
        </button>
      </form>
      </div>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' });

import { onMounted } from "vue"
import { ref } from "vue"
import { useApi } from "~/composables/useApi"
import { useToast } from 'vue-toastification'

const api = useApi()
const toast = useToast()

const name = ref('')
const stock = ref<number>()
const price = ref<number>()
const description = ref('')
const categoryId = ref<number | null>(null) // 🔥 FIX
const image = ref<File | null>(null)

const handleImageChange = (e: Event) => {
  const target = e.target as HTMLInputElement

  if (!target.files || target.files.length === 0) {
    image.value = null
    return
  }

  image.value = target.files[0] as File
}

const handleSubmit = async () => {
  try {
    if (!name.value.trim()) {
      toast.error('Name is required')
      return
    }

    if (price.value <= 0) {
      toast.error('Price must be greater than 0')
      return
    }

    if (stock.value < 0) {
      toast.error('Stock cannot be negative')
      return
    }

    if (!categoryId.value) {
      toast.error('Category is required')
      return
    }

    const formData = new FormData()
    formData.append('name', name.value)
    formData.append('stock', String(stock.value))
    formData.append('price', String(price.value))
    formData.append('description', description.value)
    formData.append('categoryId', String(categoryId.value))

    // optional image
    if (image.value) {
      formData.append('image', image.value)
    }

    const res = await api.products.create(formData)

    toast.success('Product added successfully')

    // reset
    name.value = ''
    stock.value = 0
    price.value = 0
    description.value = ''
    categoryId.value = null
    image.value = null

  } catch (err: any) {
    console.error('Product error:', err)
    toast.error(err?.data?.message || 'Something went wrong!')
  }
}

const categories = ref<any[]>([])

onMounted(async () => {
  try {
    const res = await api.category.getAll()
    categories.value = res // sesuaikan struktur API kamu
  } catch (err) {
    console.error(err)
  }
})
</script>