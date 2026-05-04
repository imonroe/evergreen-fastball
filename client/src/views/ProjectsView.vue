<template>
  <div class="page">
    <header class="page-header">
      <h1>Projects</h1>
      <div class="header-actions">
        <button class="btn-secondary" @click="showAddCluster = true">
          <svg class="btn-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
            <line x1="12" y1="11" x2="12" y2="17"/>
            <line x1="9" y1="14" x2="15" y2="14"/>
          </svg>
          Add Cluster
        </button>
        <button class="btn-primary" @click="showAdd = true">
          <span class="btn-icon">+</span> Add Project
        </button>
      </div>
    </header>

    <div class="page-body">
      <div v-if="projects.length === 0" class="empty-state">
        <p>No projects yet.</p>
        <button class="btn-primary" @click="showAdd = true">Add your first project</button>
      </div>

      <template v-else>
        <!-- Clustered sections -->
        <div
          v-for="cluster in clusters"
          :key="cluster.id"
          class="cluster-section"
        >
          <div class="cluster-header">
            <div class="cluster-header-left">
              <button
                class="chevron-btn"
                :class="{ expanded: !cluster.collapsed }"
                @click="toggleCluster(cluster)"
                :aria-label="cluster.collapsed ? 'Expand cluster' : 'Collapse cluster'"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
              <span class="cluster-name">{{ cluster.name }}</span>
            </div>
            <button class="cluster-edit-btn" @click="editClusterTarget = cluster" :aria-label="'Edit ' + cluster.name">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
          </div>

          <Draggable
            v-if="!cluster.collapsed"
            v-model="groups[cluster.id]"
            item-key="id"
            handle=".drag-handle"
            :animation="150"
            group="projects"
            @change="(evt) => onGroupChange(evt, cluster.id)"
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

          <div v-if="!cluster.collapsed && groups[cluster.id] && groups[cluster.id].length === 0" class="cluster-empty">
            No projects in this cluster. Drag one here.
          </div>
        </div>

        <!-- Unclustered projects -->
        <Draggable
          v-model="groups['unclustered']"
          item-key="id"
          handle=".drag-handle"
          :animation="150"
          group="projects"
          @change="(evt) => onGroupChange(evt, null)"
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
      </template>
    </div>

    <AddProjectModal v-if="showAdd" @save="onProjectAdded" @cancel="showAdd = false" />
    <EditProjectModal
      v-if="showEdit && editTarget"
      :project="editTarget"
      @save="onProjectSaved"
      @delete="onProjectDeleted"
      @cancel="showEdit = false"
    />
    <ClusterModal
      v-if="showAddCluster"
      @save="onClusterAdded"
      @cancel="showAddCluster = false"
    />
    <ClusterModal
      v-if="editClusterTarget"
      :cluster="editClusterTarget"
      @save="onClusterSaved"
      @delete="onClusterDeleted"
      @cancel="editClusterTarget = null"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Draggable from 'vuedraggable';
import ProjectRow from '../components/ProjectRow.vue';
import AddProjectModal from '../components/AddProjectModal.vue';
import EditProjectModal from '../components/EditProjectModal.vue';
import ClusterModal from '../components/ClusterModal.vue';
import { getProjects, addNote, reorderProjects, getPreferences, updateProject, getClusters, updateCluster } from '../api.js';
import { useToast } from '../composables/useToast.js';

const projects = ref([]);
const clusters = ref([]);
const groups = ref({});
const prefs = ref({ enterToAdd: true, timezone: '' });
const showAdd = ref(false);
const showEdit = ref(false);
const editTarget = ref(null);
const showAddCluster = ref(false);
const editClusterTarget = ref(null);
const { show } = useToast();

function rebuildGroups() {
  const g = { unclustered: [] };
  for (const cluster of clusters.value) {
    g[cluster.id] = [];
  }
  for (const project of projects.value) {
    const cid = project.clusterId;
    if (cid && g[cid] !== undefined) {
      g[cid].push(project);
    } else {
      g['unclustered'].push(project);
    }
  }
  groups.value = g;
}

onMounted(async () => {
  [projects.value, clusters.value, prefs.value] = await Promise.all([
    getProjects(),
    getClusters(),
    getPreferences(),
  ]);
  rebuildGroups();
});

async function onAddNote(project, text) {
  await addNote(project.id, text);
  show('Note saved');
}

async function onGroupChange(evt, clusterId) {
  if (evt.added) {
    const project = evt.added.element;
    project.clusterId = clusterId;
    await updateProject(project.id, { clusterId });
  }
}

async function onReorder() {
  // Flatten all groups in order: clusters first (in cluster order), then unclustered
  const allIds = [];
  for (const cluster of clusters.value) {
    const g = groups.value[cluster.id] || [];
    allIds.push(...g.map((p) => p.id));
  }
  const unclustered = groups.value['unclustered'] || [];
  allIds.push(...unclustered.map((p) => p.id));
  await reorderProjects(allIds);
}

function onProjectAdded(project) {
  project.clusterId = project.clusterId ?? null;
  projects.value.push(project);
  groups.value['unclustered'].push(project);
  showAdd.value = false;
}

function onProjectSaved(updated) {
  const idx = projects.value.findIndex((p) => p.id === updated.id);
  if (idx !== -1) projects.value[idx] = updated;
  rebuildGroups();
  showEdit.value = false;
  editTarget.value = null;
}

function onProjectDeleted(id) {
  projects.value = projects.value.filter((p) => p.id !== id);
  rebuildGroups();
  showEdit.value = false;
  editTarget.value = null;
}

async function toggleCluster(cluster) {
  cluster.collapsed = !cluster.collapsed;
  await updateCluster(cluster.id, { collapsed: cluster.collapsed });
}

function onClusterAdded(cluster) {
  clusters.value.push(cluster);
  groups.value[cluster.id] = [];
  showAddCluster.value = false;
}

function onClusterSaved(updated) {
  const idx = clusters.value.findIndex((c) => c.id === updated.id);
  if (idx !== -1) clusters.value[idx] = updated;
  editClusterTarget.value = null;
}

function onClusterDeleted(id) {
  // Move this cluster's projects to unclustered in groups
  const clusterProjects = groups.value[id] || [];
  for (const p of clusterProjects) {
    p.clusterId = null;
  }
  groups.value['unclustered'] = [...(groups.value['unclustered'] || []), ...clusterProjects];
  delete groups.value[id];
  clusters.value = clusters.value.filter((c) => c.id !== id);
  editClusterTarget.value = null;
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

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

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

.btn-secondary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 16px;
  height: 40px;
  background: transparent;
  color: #475569;
  border: 1px solid #CBD5E1;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
}

.btn-secondary:hover { background: #F1F5F9; }

.btn-icon-svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

/* Cluster header */
.cluster-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cluster-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
}

.cluster-header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.chevron-btn {
  background: none;
  color: #94A3B8;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 0;
}

.chevron-btn svg {
  width: 16px;
  height: 16px;
  transition: transform 0.2s;
  transform: rotate(0deg);
}

.chevron-btn.expanded svg {
  transform: rotate(90deg);
}

.cluster-name {
  font-size: 14px;
  font-weight: 700;
  color: #1E293B;
}

.cluster-edit-btn {
  background: none;
  color: #94A3B8;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  padding: 0;
}

.cluster-edit-btn:hover { background: #F1F5F9; color: #475569; }

.cluster-edit-btn svg {
  width: 14px;
  height: 14px;
}

.cluster-empty {
  font-size: 13px;
  color: #94A3B8;
  padding: 12px 16px;
  border: 1.5px dashed #E2E8F0;
  border-radius: 10px;
  text-align: center;
}
</style>
