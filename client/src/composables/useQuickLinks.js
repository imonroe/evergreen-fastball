import { ref } from 'vue';
import { getQuickLinks } from '../api.js';

const links = ref([]);
let initialized = false;

export function useQuickLinks() {
  async function load() {
    links.value = await getQuickLinks();
    initialized = true;
  }
  if (!initialized) load();
  return { links, load };
}
