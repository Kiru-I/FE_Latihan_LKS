<template>
  <section class="max-w-7xl mx-auto px-6 py-12">
    <h1 class="text-3xl font-bold mb-8">Checkout</h1>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

      <!-- LEFT: FORM -->
      <div class="lg:col-span-2 bg-white shadow rounded-2xl p-6">
        
        <h2 class="text-lg font-semibold mb-4">Shipping Details</h2>

        <div class="space-y-4 mb-6">
          <input v-model="form.name" type="text" placeholder="Full Name"
            class="w-full border p-3 rounded-xl" />

          <input v-model="form.phone" type="text" placeholder="Phone Number"
            class="w-full border p-3 rounded-xl" />

          <textarea v-model="form.address" placeholder="Full Address"
            class="w-full border p-3 rounded-xl"></textarea>

          <select v-model="form.shipping" class="w-full border p-3 rounded-xl">
            <option disabled value="">Select Shipping</option>
            <option value="jne">JNE</option>
            <option value="jnt">J&T</option>
            <option value="sicepat">SiCepat</option>
          </select>
        </div>

        <h2 class="text-lg font-semibold mb-3">Payment Method</h2>

        <div class="flex flex-col gap-3">
          <label class="flex items-center gap-2">
            <input type="radio" value="cod" v-model="form.payment" />
            COD
          </label>

          <label class="flex items-center gap-2">
            <input type="radio" value="bank" v-model="form.payment" />
            Bank Transfer
          </label>

          <label class="flex items-center gap-2">
            <input type="radio" value="ewallet" v-model="form.payment" />
            E-Wallet
          </label>
        </div>

      </div>

      <!-- RIGHT: SUMMARY -->
      <div class="bg-white shadow rounded-2xl p-6 h-fit sticky top-24">

        <h2 class="text-lg font-semibold mb-4">Order Summary</h2>

        <!-- items -->
        <div class="space-y-3 mb-4">
          <div 
            v-for="item in cart"
            :key="item.id"
            class="flex justify-between text-sm"
          >
            <span>{{ item.name }} x{{ item.quantity }}</span>
            <span>${{ item.price * item.quantity }}</span>
          </div>
        </div>

        <hr class="mb-4" />

        <div class="flex justify-between mb-2">
          <span>Subtotal</span>
          <span>${{ subtotal }}</span>
        </div>

        <div class="flex justify-between mb-2">
          <span>Shipping</span>
          <span>${{ shippingCost }}</span>
        </div>

        <div class="flex justify-between font-bold text-lg mb-6">
          <span>Total</span>
          <span>${{ subtotal + shippingCost }}</span>
        </div>

        <button 
          @click="checkout"
          class="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700"
        >
          Bayar Sekarang
        </button>

      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useToast } from "vue-toastification"
import { useApi } from "~/composables/useApi"


const api = useApi()
const toast = useToast()
const router = useRouter()

// state
const cart = ref([])
const loading = ref(false)

const form = ref({
  name: "",
  phone: "",
  address: "",
  shipping: "",
  payment: ""
})
  
// fetch cart
onMounted(async () => {
  try {
    cart.value = await api.cart.getCart()
  } catch (err) {
    console.error("Failed to fetch cart:", err)
  }
})

// computed subtotal
const subtotal = computed(() => {
  return cart.value.reduce((sum, item) => {
    return sum + item.price * item.quantity
  }, 0)
})

// shipping cost (simple flat rate)
const shippingCost = computed(() => {
  return form.value.shipping ? 10000 : 0
})

// total
const total = computed(() => {
  return subtotal.value + shippingCost.value
})

// format currency (IDR)
const formatPrice = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR"
  }).format(value)
}

// checkout handler
const checkout = async () => {
  // validation
  if (!cart.value.length) {
    alert("Cart kosong!")
    return
  }

  if (
    !form.value.name ||
    !form.value.phone ||
    !form.value.address ||
    !form.value.shipping ||
    !form.value.payment
  ) {
    alert("Lengkapi semua data!")
    return
  }

  try {
    loading.value = true

      const res = await api.order.checkout({
        payment: form.value.payment,
        shipping: form.value.shipping,
        name: form.value.name,
        phone: form.value.phone,
        address: form.value.address,
        image_url: null
      })

    toast.success(res.message || 'Added to cart')

    // optional: clear cart after checkout
    try {
      await api.cart.clear()
    } catch (e) {
      console.warn("Failed to clear cart:", e)
    }

    router.push(`/order/placed/${res.data.id}`)

  } catch (err) {
    toast.error(err?.data?.error || 'Checkout gagal')
  } finally {
    loading.value = false
  }
}
</script>