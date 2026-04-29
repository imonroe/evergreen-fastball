<template>
  <nav class="sidebar">
    <div class="logo-area">
      <div class="logo-row">
        <span class="logo-dot" />
        <span class="logo-title">Evergreen</span>
      </div>
      <span class="logo-sub">FASTBALL</span>
    </div>

    <ul class="nav-list">
      <li>
        <RouterLink to="/" class="nav-item" :class="{ active: route.path === '/' || route.path.startsWith('/projects') }">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
          Projects
        </RouterLink>
      </li>
      <li>
        <RouterLink to="/journal" class="nav-item" :class="{ active: route.path === '/journal' }">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
          Journal
        </RouterLink>
      </li>
      <li>
        <RouterLink to="/settings" class="nav-item" :class="{ active: route.path === '/settings' }">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
          Settings
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router';
const route = useRoute();
</script>

<style scoped>
.sidebar {
  width: 220px;
  flex-shrink: 0;
  background: #1E293B;
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.logo-area {
  padding: 28px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.logo-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #10B981;
  flex-shrink: 0;
}

.logo-title {
  color: #F8FAFC;
  font-size: 15px;
  font-weight: 700;
}

.logo-sub {
  color: #64748B;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 2px;
}

.nav-list {
  list-style: none;
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 40px;
  padding: 0 12px;
  border-radius: 8px;
  color: #64748B;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.15s, color 0.15s;
}

.nav-item:hover { background: #334155; color: #CBD5E1; }

.nav-item.active { background: #10B981; color: #fff; }

.nav-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}
</style>
