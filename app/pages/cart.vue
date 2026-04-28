<template>
  <section class="max-w-7xl mx-auto px-6 py-12">
    <h2 class="text-3xl font-bold mb-8">Your Cart</h2>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <!-- LEFT -->
      <div class="lg:col-span-2">
        
        <!-- ✅ TABLE (only if cart has items) -->
        <div v-if="cart.length > 0" class="bg-white shadow rounded-2xl overflow-hidden">
          <table class="w-full">
            
            <thead class="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th class="p-4 text-left  ">Product</th>
                <th class="p-4 text-center">Price</th>
                <th class="p-4 text-center">Qty</th>
                <th class="p-4 text-center">Total</th>
                <th class="p-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody class="divide-y">
              <tr 
                v-for="item in cart" 
                :key="item.id"
                class="hover:bg-gray-50"
              >
                
                <td class="p-4">
                  <div class="flex items-center gap-4">
                    <div class="w-20 h-20 overflow-hidden rounded-xl flex-shrink-0">
                      <img 
                        :src="item.image"
                        class="w-full h-full object-cover block"
                      />
                    </div>
                    <div>
                      <p class="font-semibold">{{ item.name }}</p>
                      <p class="text-sm text-gray-500">{{ item.category }}</p>
                    </div>
                  </div>
                </td>

                <td class="p-4 text-center">
                  ${{ item.price }}
                </td>

                <td class="p-4">
                  <div class="flex justify-center items-center gap-2">
                    <button @click="decrease(item)" class="px-2 py-1 border rounded">-</button>
                    <span>{{ item.quantity }}</span>
                    <button @click="increase(item)" class="px-2 py-1 border rounded">+</button>
                  </div>
                </td>

                <td class="p-4 text-center font-semibold">
                  ${{ item.price * item.quantity }}
                </td>

                <td class="p-4 text-center">
                  <button 
                    @click="removeItem(item.productId)"
                    class="text-red-500 hover:text-red-600 text-sm"
                  >
                    Remove
                  </button>
                </td>

              </tr>
            </tbody>
          </table>
        </div>

        <!-- ✅ EMPTY STATE -->
        <div v-else class="bg-white shadow rounded-2xl p-12 text-center">
          <div class="text-5xl mb-4">🛒</div>
          <h3 class="text-xl font-semibold mb-2">Your cart is empty</h3>
          <p class="text-gray-500 mb-6">
            Looks like you haven’t added anything yet.
          </p>

          <button class="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700">
            <a href="/">Start Shopping</a>
          </button>
        </div>

      </div>

      <!-- RIGHT (only show if cart not empty) -->
      <div 
        v-if="cart.length > 0"
        class="bg-white shadow rounded-2xl p-6 h-fit sticky top-24"
      >
        
        <h3 class="text-lg font-semibold mb-4">Summary</h3>

        <div class="flex justify-between mb-2">
          <span class="text-gray-600">Subtotal</span>
          <span>${{ subtotal }}</span>
        </div>

        <div class="flex justify-between mb-4">
          <span class="text-gray-600">Shipping</span>
          <span>Free</span>
        </div>

        <div class="flex justify-between text-lg font-bold mb-6">
          <span>Total</span>
          <span>${{ subtotal }}</span>
        </div>

        <div class="flex flex-col gap-3">
          <NuxtLink 
            to="/checkout"
            class="block text-center w-full bg-indigo-600 text-white py-3 rounded-xl"
          >
            Checkout
          </NuxtLink>
          <button class="w-full border py-3 rounded-xl hover:bg-gray-100">
            Continue Shopping
          </button>
        </div>

      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useApi } from "~/composables/useApi"
import { useToast } from 'vue-toastification'

const api = useApi()
const toast = useToast()
const cart = ref([])
const loading = ref(false)

// ✅ Fetch cart
const fetchCart = async () => {
  try {
    loading.value = true
    const data = await api.cart.getCart()
    cart.value = data
    console.log(data)
  } catch (err) {
    console.error("Failed to fetch cart:", err)
  } finally {
    loading.value = false
  }
}

// ✅ Increase quantity
const increase = async (item) => {
  try {
    await api.cart.increase(item.productId)
    item.quantity++ // optimistic update ⚡
  } catch (err) {
    console.error("Increase failed:", err)
  }
}

// ✅ Decrease quantity
const decrease = async (item) => {
  if (item.quantity <= 1) return

  try {
    await api.cart.decrease(item.productId)
    item.quantity-- // optimistic update ⚡
  } catch (err) {
    console.error("Decrease failed:", err)
  }
}

// ✅ Remove item
const removeItem = async (productId) => {
  if (!confirm("Remove this item?")) return

  try {
    const res = await api.cart.remove(productId)
    cart.value = cart.value.filter(
      (item) => item.productId !== productId
    )
  toast.success(res.message || 'Item removed')
  } catch (err) {
  toast.error(err?.data?.error || 'Failed to remove item')
  }
}

// ✅ Subtotal
const subtotal = computed(() => {
  return cart.value.reduce((sum, item) => {
    return sum + item.price * item.quantity
  }, 0)
})

// 🚀 Load on mount
onMounted(fetchCart)
</script>