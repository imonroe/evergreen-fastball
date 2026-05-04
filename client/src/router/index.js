import { createRouter, createWebHistory } from 'vue-router';
import ProjectsView from '../views/ProjectsView.vue';
import ProjectNotesView from '../views/ProjectNotesView.vue';
import ClusterNotesView from '../views/ClusterNotesView.vue';
import JournalView from '../views/JournalView.vue';
import SettingsView from '../views/SettingsView.vue';

const routes = [
  { path: '/', component: ProjectsView },
  { path: '/projects/:id/notes', component: ProjectNotesView },
  { path: '/clusters/:id/notes', component: ClusterNotesView },
  { path: '/journal', component: JournalView },
  { path: '/settings', component: SettingsView },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
