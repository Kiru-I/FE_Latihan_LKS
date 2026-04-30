<template>
  <NuxtLink
    :to="`/product/${product.id}`"
    class="block"
  >
    <div class="bg-white p-4 rounded-2xl shadow hover:shadow-lg transition">
      <img
        :src="product.imageUrl"
        class="w-full h-40 object-cover rounded-xl mb-4"
      />

      <h4 class="font-semibold text-lg">
        {{ product.name }}
      </h4>

      <p class="text-gray-500">
        ${{ product.price }}
      </p>

      <button
        :disabled="loading || product.stock < 1"
        class="mt-3 w-full py-2 rounded-xl text-white"
        :class="product.stock < 1 
          ? 'bg-gray-400 cursor-not-allowed' 
          : 'bg-indigo-600 hover:bg-indigo-700'"
        @click.prevent="addToCart(product.id)"
      >
        {{
          product.stock < 1
            ? "Out of Stock"
            : (loading ? "Adding..." : "Add to Cart")
        }}
      </button>
    </div>
  </NuxtLink>
</template>

<script setup>
import { useCart } from '~/composables/useCart'

const props = defineProps({
  product: Object
})

const { addToCart, loading } = useCart()
</script>