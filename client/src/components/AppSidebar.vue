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

    <div v-if="links.length > 0" class="ql-section">
      <div class="ql-divider" />
      <span class="ql-label">QUICK LINKS</span>
      <a
        v-for="link in links"
        :key="link.id"
        :href="link.url"
        target="_blank"
        rel="noopener noreferrer"
        class="ql-item"
      >
        <svg class="ql-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
          <polyline points="15 3 21 3 21 9"/>
          <line x1="10" y1="14" x2="21" y2="3"/>
        </svg>
        <span class="ql-label-text">{{ link.label }}</span>
      </a>
    </div>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { useQuickLinks } from '../composables/useQuickLinks.js';

const route = useRoute();
const { links } = useQuickLinks();
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

.ql-section {
  padding: 0 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ql-divider {
  height: 1px;
  background: #334155;
  margin-bottom: 10px;
}

.ql-label {
  color: #64748B;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 1.5px;
  padding: 0 12px;
  margin-bottom: 4px;
}

.ql-item {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 36px;
  padding: 0 12px;
  border-radius: 8px;
  color: #64748B;
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
  transition: background 0.15s, color 0.15s;
  overflow: hidden;
}

.ql-item:hover { background: #334155; color: #CBD5E1; }

.ql-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.ql-label-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
