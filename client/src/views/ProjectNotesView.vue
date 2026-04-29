<template>
  <div class="page">
    <header class="page-header">
      <RouterLink to="/" class="back-link">
        <span class="back-arrow">←</span> Projects
      </RouterLink>
      <h1>{{ project ? project.name : '' }} — Notes</h1>
    </header>

    <div class="page-body">
      <div v-if="loading" class="state-msg">Loading…</div>
      <div v-else-if="notes.length === 0" class="state-msg">No notes yet for this project.</div>
      <div v-else class="notes-list">
        <div v-for="note in notes" :key="note.timestamp + note.text" class="note-card">
          <span class="note-ts">{{ note.timestamp }}</span>
          <span class="note-text">{{ note.text }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getProjects, getProjectNotes } from '../api.js';

const route = useRoute();
const notes = ref([]);
const project = ref(null);
const loading = ref(true);

onMounted(async () => {
  const [projects, fetchedNotes] = await Promise.all([
    getProjects(),
    getProjectNotes(route.params.id),
  ]);
  project.value = projects.find((p) => p.id === route.params.id) ?? null;
  notes.value = fetchedNotes;
  loading.value = false;
});
</script>

<style scoped>
.page { display: flex; flex-direction: column; height: 100%; }

.page-header {
  padding: 16px 32px 16px 32px;
  background: #fff;
  border-bottom: 1px solid #E2E8F0;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.back-link {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #10B981;
  font-size: 13px;
  font-weight: 500;
  width: fit-content;
}

.back-link:hover { text-decoration: underline; }
.back-arrow { font-size: 14px; }

.page-header h1 { font-size: 22px; font-weight: 700; }

.page-body { flex: 1; overflow-y: auto; padding: 28px 32px; }

.state-msg { color: #64748B; text-align: center; margin-top: 60px; }

.notes-list { display: flex; flex-direction: column; gap: 10px; }

.note-card {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  background: #fff;
  border-radius: 10px;
  padding: 14px 20px;
  box-shadow: 0 1px 3px #0F172210;
}

.note-ts {
  flex-shrink: 0;
  width: 160px;
  color: #64748B;
  font-size: 13px;
  font-variant-numeric: tabular-nums;
}

.note-text { color: #0F172A; line-height: 1.5; }
</style>
