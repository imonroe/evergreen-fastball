<template>
  <div class="page">
    <header class="page-header">
      <h1>Settings</h1>
    </header>

    <div class="page-body">
      <section class="settings-section">
        <h2>Note Capture</h2>
        <div class="divider" />

        <div class="setting-row">
          <div class="setting-info">
            <span class="setting-label">Press Enter to add a note</span>
            <span class="setting-desc">Submits the note when you press Enter in the quick-note field</span>
          </div>
          <button
            class="toggle"
            :class="{ on: prefs.enterToAdd }"
            @click="toggle('enterToAdd')"
            :aria-checked="prefs.enterToAdd"
            role="switch"
          >
            <span class="toggle-thumb" />
          </button>
        </div>

        <div class="setting-row">
          <div class="setting-info">
            <span class="setting-label">Timezone</span>
            <span class="setting-desc">Used for all timestamps written to Obsidian files</span>
          </div>
          <input
            class="tz-input"
            type="text"
            v-model="prefs.timezone"
            placeholder="e.g. America/Los_Angeles"
            @change="save"
          />
        </div>
      </section>

      <section class="settings-section">
        <h2>Vault</h2>
        <div class="divider" />

        <div class="setting-row">
          <div class="setting-info">
            <span class="setting-label">Vault Root Path</span>
            <span class="setting-desc">Set via OBSIDIAN_VAULT environment variable at container startup</span>
          </div>
          <span class="vault-value">{{ vaultPath || '(not set)' }}</span>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getPreferences, updatePreferences } from '../api.js';
import { useToast } from '../composables/useToast.js';

const prefs = ref({ enterToAdd: true, timezone: '' });
const vaultPath = ref('');
const { show } = useToast();

onMounted(async () => {
  prefs.value = await getPreferences();
  // read vault path from a dedicated endpoint or embed it at build time;
  // here we expose it via a lightweight meta endpoint
  try {
    const res = await fetch('/api/preferences/vault-path');
    if (res.ok) vaultPath.value = (await res.json()).vaultPath;
  } catch { /* env var display is best-effort */ }
});

async function toggle(key) {
  prefs.value[key] = !prefs.value[key];
  await save();
}

async function save() {
  await updatePreferences({ enterToAdd: prefs.value.enterToAdd, timezone: prefs.value.timezone });
  show('Settings saved');
}
</script>

<style scoped>
.page { display: flex; flex-direction: column; height: 100%; }

.page-header {
  display: flex;
  align-items: center;
  padding: 20px 32px;
  background: #fff;
  border-bottom: 1px solid #E2E8F0;
  flex-shrink: 0;
}

.page-header h1 { font-size: 22px; font-weight: 700; }

.page-body {
  flex: 1;
  overflow-y: auto;
  padding: 36px 40px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.settings-section { display: flex; flex-direction: column; gap: 16px; }

.settings-section h2 { font-size: 16px; font-weight: 700; }

.divider { height: 1px; background: #E2E8F0; }

.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  background: #fff;
  border-radius: 12px;
  padding: 16px 20px;
  box-shadow: 0 1px 4px #0F172210;
}

.setting-info { display: flex; flex-direction: column; gap: 3px; flex: 1; }

.setting-label { font-size: 14px; font-weight: 600; color: #0F172A; }

.setting-desc { font-size: 13px; color: #64748B; }

.toggle {
  flex-shrink: 0;
  width: 48px;
  height: 28px;
  border-radius: 14px;
  background: #CBD5E1;
  padding: 3px;
  display: flex;
  align-items: center;
  transition: background 0.2s;
}

.toggle.on { background: #10B981; justify-content: flex-end; }

.toggle-thumb {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #fff;
  display: block;
}

.tz-input {
  width: 220px;
  height: 40px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  background: #F8FAFC;
  padding: 0 14px;
  font-size: 13px;
  color: #0F172A;
}

.tz-input:focus { border-color: #10B981; }

.vault-value {
  font-size: 13px;
  font-weight: 500;
  color: #475569;
  background: #F1F5F9;
  padding: 0 14px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  white-space: nowrap;
}
</style>
