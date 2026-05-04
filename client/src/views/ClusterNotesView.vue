<template>
  <div class="page">
    <header class="page-header">
      <RouterLink to="/" class="back-link">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        Projects
      </RouterLink>
      <h1>{{ clusterName }}</h1>
    </header>

    <div class="page-body">
      <div v-if="loading" class="state-msg">Loading…</div>
      <div v-else-if="entries.length === 0" class="state-msg">
        No notes yet in this cluster.
      </div>
      <div v-else class="journal-list">
        <div v-for="entry in entries" :key="entry.projectId + entry.timestamp" class="entry-card">
          <span
            class="project-badge"
            :style="{ background: entry.projectColor.bg, color: entry.projectColor.text }"
          >{{ entry.projectName }}</span>
          <div class="entry-right">
            <span class="entry-ts">{{ entry.timestamp }}</span>
            <span class="entry-text">{{ entry.text }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getClusterNotes, getClusters } from '../api.js';

const route = useRoute();
const entries = ref([]);
const clusterName = ref('');
const loading = ref(true);

onMounted(async () => {
  const clusterId = route.params.id;
  const [notes, clusters] = await Promise.all([
    getClusterNotes(clusterId),
    getClusters(),
  ]);
  entries.value = notes;
  clusterName.value = clusters.find((c) => c.id === clusterId)?.name ?? 'Cluster';
  loading.value = false;
});
</script>

<style scoped>
.page { display: flex; flex-direction: column; height: 100%; }

.page-header {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px 32px;
  background: #fff;
  border-bottom: 1px solid #E2E8F0;
  flex-shrink: 0;
}

.page-header h1 { font-size: 22px; font-weight: 700; }

.back-link {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #64748B;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;
}

.back-link:hover { color: #0F172A; }

.back-link svg { width: 16px; height: 16px; }

.page-body { flex: 1; overflow-y: auto; padding: 28px 32px; }

.state-msg { color: #64748B; text-align: center; margin-top: 60px; }

.journal-list { display: flex; flex-direction: column; gap: 10px; }

.entry-card {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  background: #fff;
  border-radius: 10px;
  padding: 14px 20px;
  box-shadow: 0 1px 3px #0F172210;
}

.project-badge {
  flex-shrink: 0;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  margin-top: 1px;
}

.entry-right {
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
}

.entry-ts { color: #64748B; font-size: 12px; font-variant-numeric: tabular-nums; }
.entry-text { color: #0F172A; line-height: 1.5; }
</style>
