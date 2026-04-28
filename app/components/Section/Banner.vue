<template>
  <section class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
    <div class="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-10">
      
      <div class="max-w-lg">
        <h2 class="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          {{ title }}
        </h2>
        <p class="text-lg opacity-90 mb-6">
          {{ subtitle }}
        </p>
         <NuxtLink to="/shop" class="bg-white text-indigo-600 px-6 py-3 rounded-2xl font-semibold hover:scale-105 transition">
          {{ buttonText }}
        </NuxtLink>
      </div>

      <div>
        <img 
          :src="image" 
          class="w-80 md:w-96 rounded-2xl shadow-lg"
        />
      </div>

    </div>
  </section>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: "Big Sale Up To 50% Off"
  },
  subtitle: {
    type: String,
    default: "Don't miss out on our biggest discounts of the year."
  },
  buttonText: {
    type: String,
    default: "Shop Now"
  },
  image: {
    type: String,
    default: "https://picsum.photos/400/300"
  }
})
</script>