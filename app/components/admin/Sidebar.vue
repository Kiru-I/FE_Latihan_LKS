<script setup lang="ts">
import { useRoute, useRouter } from "#imports";

const route = useRoute();
const router = useRouter();

const menu = [
  { id: "orders", name: "Manage Orders", icon: "📦", path: "/admin/orders" },
  { id: "products", name: "Manage Products", icon: "🛒", path: "/admin/products" },
];

const goTo = (path: string) => {
  router.push(path);
};


</script>

<template>
  <aside class="w-64 bg-indigo-600 text-white flex flex-col p-4">
    <h1 class="text-xl font-bold mb-6">Admin Panel</h1>

    <nav class="flex flex-col gap-2">
      <button
        v-for="item in menu"
        :key="item.id"
        @click="goTo(item.path)"
        class="flex items-center gap-3 px-4 py-2 rounded-lg transition bg-gray-300 text-gray-600"
        :class="route.path === item.path ? 'bg-white text-indigo-600' : 'hover:bg-gray-200 hover:text-indigo-600'"
      >
        <span>{{ item.icon }}</span>
        <span>{{ item.name }}</span>
      </button>
    </nav>
  </aside>
</template>