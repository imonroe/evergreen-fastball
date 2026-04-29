<template>
  <div class="app-shell">
    <AppSidebar />
    <main class="app-main">
      <RouterView />
    </main>
    <AppToast />
  </div>
</template>

<script setup>
import AppSidebar from './components/AppSidebar.vue';
import AppToast from './components/AppToast.vue';
</script>

<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Inter', system-ui, sans-serif;
  background: #F1F5F9;
  color: #0F172A;
  font-size: 14px;
  line-height: 1.5;
}

.app-shell {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.app-main {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

button { cursor: pointer; font-family: inherit; font-size: 14px; border: none; }
input  { font-family: inherit; font-size: 14px; outline: none; }
a      { text-decoration: none; color: inherit; }
</style>
