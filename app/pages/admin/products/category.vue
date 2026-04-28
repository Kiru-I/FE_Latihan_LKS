<template>
    <div>
        <h2 class="text-2xl font-semibold mb-4">Manage Products</h2>
        <div class="bg-white shadow rounded-2xl overflow-hidden p-10">
        <h2 class="text-xl font-semibold mb-4">Add Category</h2>
                <div class="bg-gray-50 shadow rounded-2xl overflow-hidden p-2">
      <form @submit.prevent="handleSubmit">
        <input
          v-model="name"
          type="text"
          placeholder="Name"
          class="bg-gray-50 text-gray-600 w-full p-2 mb-3 border rounded text-sm"
        />
        <button type="submit" class="w-full bg-indigo-600 text-white py-2 rounded">
            Add Category
        </button>
      </form>
      </div>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' });

import { ref } from "vue"
import { useApi } from "~/composables/useApi"
import { useToast } from 'vue-toastification'

const api = useApi()
const toast = useToast()

const name = ref('')

const handleSubmit = async () => {
  try {
    // 🔥 VALIDATION (WAJIB)
    if (!name.value.trim()) {
      toast.error('Name is required')
      return
    }

    const res = await api.category.create({
      name: name.value,
    })

    toast.success('Category added successfully')

    // reset form
    name.value = ''

  } catch (err: any) {
    console.error('Category error:', err)
    toast.error(err?.data?.message || 'Something went wrong!')
  }
}
</script>