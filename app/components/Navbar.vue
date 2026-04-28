<template>
  <header class="bg-white shadow sticky top-0 z-50">
    <div class="w-full px-34 py-4 flex items-center">
      
      <div class="w-1/4">
        <h1 class="text-2xl font-bold text-indigo-600"><a href="/">Voxshop</a></h1>
      </div>

      <div class="w-2/4 flex justify-center">
        <div class="w-full max-w-md relative">
          <input
            v-model="searchQuery"
            @keyup.enter="onSearch"
            type="text"
            placeholder="Search products..."
            class="w-full border rounded-xl px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <span class="absolute left-3 top-2.5 text-gray-400 cursor-pointer" @click="onSearch">🔍</span>
        </div>
      </div>

      <div class="w-1/4 flex justify-end items-center gap-6">
        <NuxtLink to="/" class="text-gray-600 hover:text-indigo-600">Home</NuxtLink>
        <NuxtLink to="/shop" class="text-gray-600 hover:text-indigo-600">Shop</NuxtLink>

        <!-- Show Sign In if not logged in -->
        <button v-if="!user" @click="login = true" class="bg-indigo-600 text-white px-4 py-2 rounded-xl">
          Sign In
        </button>

        <AuthModal :open="login" @close="login = false" @logged-in="setUser" />

        <div v-if="user" class="relative">
          <img
            src="/img/profile.png"
            class="w-10 h-10 rounded-full cursor-pointer border"
            @click="toggleDropdown"
          />

          <div
            v-if="open"
            class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border"
          >
            <NuxtLink to="/cart" class="block px-4 py-2 hover:bg-gray-100">Cart</NuxtLink>
            <NuxtLink to="/order" class="block px-4 py-2 hover:bg-gray-100">Order History</NuxtLink>
            <a v-if="isAdmin" href="/admin/orders" class="block px-4 py-2 hover:bg-gray-100">Admin Panel</a>
            <hr />
            <a @click="logout" class="block px-4 py-2 text-red-500 hover:bg-gray-100">
              Logout
            </a>
          </div>
        </div>
      </div>

    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import AuthModal from './AuthModal.vue'
import { useApi } from '~/composables/useApi'

const router = useRouter()
const login = ref(false)
const open = ref(false)
const user = useState('user', () => null) // ✅ global state
const api = useApi()

const isAdmin = computed(() => {
  return user.value?.role === 'admin'
})

const searchQuery = ref('')

const onSearch = () => {
  const query = searchQuery.value.trim()
  if (query) {
    router.push({ path: '/shop', query: { q: query } })
  } else {
    router.push({ path: '/shop' })
  }
}

const toggleDropdown = () => {
  open.value = !open.value
}

// ✅ fetch user on refresh
onMounted(async () => {
  const token = localStorage.getItem('token')

  if (token && !user.value) {
    try {
      const res = await api.auth.getMe()
      user.value = res // ✅ correct (no .user)
    } catch {
      localStorage.removeItem('token')
    }
  }
})

const logout = () => {
  localStorage.removeItem('token')
  user.value = null
  open.value = false
  toast.success('Logout Berhasil')
}
</script>