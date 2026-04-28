<template>
  <div v-if="open" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-2xl shadow w-80 relative">
      <button @click="$emit('close')" class="absolute top-2 right-2 text-gray-500">✕</button>

      <h2 class="text-xl font-bold mb-4 text-center">
        {{ isLogin ? 'Login' : 'Sign Up' }}
      </h2>

      <!-- Form wrapper -->
      <form @submit.prevent="handleSubmit">
        <input
          v-if="!isLogin"
          v-model="name"
          type="text"
          placeholder="Name"
          class="w-full mb-3 p-2 border rounded"
        />
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="w-full mb-3 p-2 border rounded"
        />
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="w-full mb-4 p-2 border rounded"
        />

        <button type="submit" class="w-full bg-indigo-600 text-white py-2 rounded">
          {{ isLogin ? 'Login' : 'Sign Up' }}
        </button>
      </form>

      <p class="text-sm mt-3 text-center">
        <span v-if="isLogin">Don't have an account?</span>
        <span v-else>Already have an account?</span>
        <button @click="toggleMode" class="text-indigo-600 ml-1">
          {{ isLogin ? 'Sign up' : 'Login' }}
        </button>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue' 
import { useApi } from '~/composables/useApi' 
import { useToast } from 'vue-toastification'

const props = defineProps({ open: Boolean }) 
const emit = defineEmits(['close']) // ✅ removed logged-in

const api = useApi() 
const toast = useToast()

const isLogin = ref(true) 
const name = ref('') 
const email = ref('') 
const password = ref('') 

const toggleMode = () => { 
  isLogin.value = !isLogin.value 
}

const handleSubmit = async () => {
  try {
    if (isLogin.value) {
      const res = await api.auth.login({ 
        email: email.value, 
        password: password.value 
      })

      localStorage.setItem('token', res.token)

      const me = await api.auth.getMe()

      // ✅ GLOBAL STATE UPDATE (KEY FIX)
      const userState = useState('user')
      userState.value = me // ✅ correct (no .user)

      toast.success(res.message || 'Login Berhasil')

    } else {
      const res = await api.auth.register({
        name: name.value,
        email: email.value,
        password: password.value
      })
      
      toast.success(res.message || 'Register Berhasil')
      isLogin.value = true
    }

    emit('close')

    // reset form
    name.value = ''
    email.value = ''
    password.value = ''

  } catch (err) {
    console.error('Auth error:', err)
    toast.error(err?.data?.error || 'Something went wrong!')
  }
}
</script>