<template>
  <div class="page">
    <header class="page-header">
      <h1>Projects</h1>
      <button class="btn-primary" @click="showAdd = true">
        <span class="btn-icon">+</span> Add Project
      </button>
    </header>

    <div class="page-body">
      <div v-if="projects.length === 0" class="empty-state">
        <p>No projects yet.</p>
        <button class="btn-primary" @click="showAdd = true">Add your first project</button>
      </div>

      <Draggable
        v-else
        v-model="projects"
        item-key="id"
        handle=".drag-handle"
        :animation="150"
        @end="onReorder"
      >
        <template #item="{ element }">
          <ProjectRow
            :project="element"
            :enter-to-add="prefs.enterToAdd"
            @add-note="(text) => onAddNote(element, text)"
            @list="() => $router.push(`/projects/${element.id}/notes`)"
            @edit="() => { editTarget = element; showEdit = true }"
          />
        </template>
      </Draggable>
    </div>

    <AddProjectModal v-if="showAdd" @save="onProjectAdded" @cancel="showAdd = false" />
    <EditProjectModal
      v-if="showEdit && editTarget"
      :project="editTarget"
      @save="onProjectSaved"
      @delete="onProjectDeleted"
      @cancel="showEdit = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Draggable from 'vuedraggable';
import ProjectRow from '../components/ProjectRow.vue';
import AddProjectModal from '../components/AddProjectModal.vue';
import EditProjectModal from '../components/EditProjectModal.vue';
import { getProjects, addNote, reorderProjects, getPreferences } from '../api.js';
import { useToast } from '../composables/useToast.js';

const projects = ref([]);
const prefs = ref({ enterToAdd: true, timezone: '' });
const showAdd = ref(false);
const showEdit = ref(false);
const editTarget = ref(null);
const { show } = useToast();

onMounted(async () => {
  [projects.value, prefs.value] = await Promise.all([getProjects(), getPreferences()]);
});

async function onAddNote(project, text) {
  await addNote(project.id, text);
  show('Note saved');
}

async function onReorder() {
  await reorderProjects(projects.value.map((p) => p.id));
}

function onProjectAdded(project) {
  projects.value.push(project);
  showAdd.value = false;
}

function onProjectSaved(updated) {
  const idx = projects.value.findIndex((p) => p.id === updated.id);
  if (idx !== -1) projects.value[idx] = updated;
  showEdit.value = false;
  editTarget.value = null;
}

function onProjectDeleted(id) {
  projects.value = projects.value.filter((p) => p.id !== id);
  showEdit.value = false;
  editTarget.value = null;
}
</script>

<style scoped>
.page { display: flex; flex-direction: column; height: 100%; }

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 32px;
  background: #fff;
  border-bottom: 1px solid #E2E8F0;
  flex-shrink: 0;
}

.page-header h1 { font-size: 22px; font-weight: 700; }

.page-body {
  flex: 1;
  overflow-y: auto;
  padding: 28px 32px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  flex: 1;
  color: #64748B;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 20px;
  height: 40px;
  background: #10B981;
  color: #fff;
  border-radius: 8px;
  font-weight: 600;
}

.btn-primary:hover { background: #059669; }
.btn-icon { font-size: 18px; line-height: 1; }
</style>
