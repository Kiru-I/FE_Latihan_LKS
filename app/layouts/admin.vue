<template>
  <Navbar/>
  <div class="flex h-screen">
    <AdminSidebar />
    <main class="flex-1 bg-gray-100 p-6">
      <slot />
    </main>
  </div>
</template>