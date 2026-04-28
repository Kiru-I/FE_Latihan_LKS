<script setup lang="ts">
import { ref } from "vue";

const active = ref("orders");
</script>

<template>
  <div class="flex h-screen">
    <AdminSidebar 
      :active="active" 
      @change="active = $event"
    />

    <main class="flex-1 bg-gray-100 p-6">
      <AdminManageOrder v-if="active === 'orders'" />
      <AdminManageProduct v-else />
    </main>
  </div>
</template>