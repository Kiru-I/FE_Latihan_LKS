<template>
  <div>
    <h2 class="text-2xl font-semibold mb-4">Manage Products</h2>

    <div class="bg-white p-4 rounded-xl shadow">
      <div class="flex justify-between mb-4">
        <span class="font-medium">Product List</span>
        <div>
        <NuxtLink to="/admin/products/category" class="bg-green-500 text-white px-4 py-1 rounded-lg">
          + Add Category
        </NuxtLink>
                <NuxtLink to="/admin/products/add" class="bg-green-500 text-white px-4 py-1 rounded-lg m-1">
          + Add Product
        </NuxtLink>
        </div>
      </div>

        <div class="bg-white shadow rounded-2xl overflow-hidden">
          <table class="w-full">
            
            <thead class="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th class="p-4 text-left  ">Product</th>
                <th class="p-4 text-center">Price</th>
                <th class="p-4 text-center">Stock</th>
                <th class="p-4 text-center">Description</th>
                <th class="p-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody class="divide-y">
              <tr 
                v-for="product in products" 
                :key="product.id"
                class="hover:bg-gray-50"
              >
                
                <td class="p-4">
                  <div class="flex items-center gap-4">
                    <div class="w-20 h-20 overflow-hidden rounded-xl shrink-0">
                      <img 
                        :src="product.imageUrl"
                        class="w-full h-full object-cover block"
                      />
                    </div>
                    <div>
                      <p class="font-semibold">{{ product.name }}</p>
                      <p class="text-sm text-gray-500">{{ product.categoryName }}</p>
                    </div>
                  </div>
                </td>

                <td class="p-4 text-center">
                  ${{ product.price }}
                </td>

                <td class="p-4">
                  <div class="flex justify-center items-center gap-2">
                    <span>{{ product.stock }}</span>
                  </div>
                </td>

                <td class="p-4 text-center font-semibold">
                  {{ product.description }}
                </td>

                <td class="p-4 text-center">
                  <div display="flex" class="flex flex-col gap-2">
                  <button 
                    @click="deleteProduct(product.id)"
                    class="bg-red-500 text-white px-4 py-1 rounded-lg m-1"
                  >
                    Remove
                  </button>
                  <NuxtLink
                    :to="`/admin/products/edit/${product.id}`" 
                    class="bg-blue-500 text-white px-4 py-1 rounded-lg m-1"
                  >
                    Edit
                  </NuxtLink>
                  </div>
                </td>

              </tr>
            </tbody>
          </table>
          </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' });

import { ref, onMounted } from "vue"
import { useApi } from "~/composables/useApi"
import { useToast } from 'vue-toastification'
import type { Product } from "~/types/products";

const api = useApi()
const toast = useToast()

const products = ref(<Product[]>([]))
const loading = ref(false)

const fetchProduct = async () => {
  try {
    loading.value = true
    const res = await api.products.getAll()
    products.value = res.data
    console.log(products.value) 
  } catch (err) {
    console.error("Failed to fetch product:", err)
    toast.error("Failed to load products")
  } finally {
    loading.value = false
  }
}

// ✅ Delete product (admin action)
const deleteProduct = async (id: number) => {
  if (!confirm("Delete this product?")) return

  try {
    await api.products.delete(id)
    products.value = products.value.filter(p => p.id !== id)
    toast.success("Product deleted")
  } catch (err: any) {
    console.error(err)
    toast.error(err?.data?.error || "Failed to delete")
  }
}

// 🚀 Load on mount
onMounted(fetchProduct)
</script>