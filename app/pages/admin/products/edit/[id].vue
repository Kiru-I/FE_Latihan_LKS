<template>
    <div>
        <h2 class="mb-4 text-2xl font-semibold">Manage Products</h2>
        <div class="p-10 overflow-hidden bg-white shadow rounded-2xl">
        <h2 class="mb-4 text-xl font-semibold">Edit Product</h2>
                <div class="p-2 overflow-hidden shadow bg-gray-50 rounded-2xl">
      <form @submit.prevent="handleSubmit">
        <input
          v-model="name"
          type="text"
          placeholder="Name"
          class="w-full p-2 mb-3 text-sm text-gray-600 border rounded bg-gray-50"
        />
        <input
          v-model="stock"
          type="number"
          placeholder="Stock"
          class="w-full p-2 mb-3 text-sm text-gray-600 border rounded bg-gray-50"
        />
        <input
          v-model="price"
          type="number"
          placeholder="Price"
          class="w-full p-2 mb-3 text-sm text-gray-600 border rounded bg-gray-50"
        />
        <input
          v-model="description"
          type="text"
          placeholder="Description"
          class="w-full p-2 mb-3 text-sm text-gray-600 border rounded bg-gray-50"
        />
        <input
            type="file"
            @change="handleImageChange"
            class="w-full p-2 mb-3 text-sm text-gray-600 border rounded bg-gray-50"
        />
        <img 
          v-if="imagePreview" 
          :src="imagePreview" 
          class="w-32 h-32 object-cover rounded mb-3"
        />

        <select
          v-model="categoryId"
          class="w-full p-2 mb-3 text-sm text-gray-600 border rounded bg-gray-50"
            placeholder="Category"
          >
          <option :value="null" disabled>Select category</option>
          <option 
            v-for="cat in categories" 
            :key="cat.id" 
            :value="cat.id"
          >
            {{ cat.name }}
          </option>
        </select>

        <button type="submit" class="w-full py-2 text-white bg-indigo-600 rounded">
            Edit Product
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
const route = useRoute()
const imagePreview = ref<string | null>(null)
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
    imagePreview.value = null
    return
  }

  const file = target.files[0]
  image.value = file

  // 🔥 create preview URL
  imagePreview.value = URL.createObjectURL(file)
}

const GetProduct = async () => {
  try {
    const res = await api.products.getById(Number(route.params.id))
    const product = res

    name.value = product.name
    stock.value = product.stock
    price.value = product.price
    description.value = product.description
    categoryId.value = product.categoryId

    // set preview to existing image
    if (product.imageUrl) {
      imagePreview.value = product.imageUrl
    }

  } catch (err) {
    console.error('Get product error:', err)
    toast.error('Failed to load product data')
  }
}

const handleSubmit = async () => {
  try {
    if (!name.value.trim()) {
      toast.error('Name is required')
      return
    }

    if (!price.value || isNaN(price.value)) {
      toast.error('Invalid price')
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
    const res = await api.products.update(Number(route.params.id), formData)

    toast.success('Product edited successfully')

    // reset
    GetProduct()

  } catch (err: any) {
    console.error('Product error:', err)
    toast.error(err?.data?.message || 'Something went wrong!')
  }
}

const categories = ref<any[]>([])

onMounted(async () => {
  try {
    const res = await api.category.getAll()
    GetProduct()
    categories.value = res
  } catch (err) {
    console.error(err)
  }
})
</script>