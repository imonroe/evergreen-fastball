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
            <span class="setting-label">Link timestamps to Daily Notes</span>
            <span class="setting-desc">Writes dates as <code>[[2026-04-29]]</code> so they link to your Obsidian Daily Note</span>
          </div>
          <button
            class="toggle"
            :class="{ on: prefs.dailyNoteLinks }"
            @click="toggle('dailyNoteLinks')"
            :aria-checked="prefs.dailyNoteLinks"
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

      <section class="settings-section">
        <h2>Daily Note</h2>
        <div class="divider" />

        <div class="setting-row">
          <div class="setting-info">
            <span class="setting-label">Daily Note quick-note</span>
            <span class="setting-desc">Pins a row at the top of Projects that appends a note to today's Daily Note file</span>
          </div>
          <button
            class="toggle"
            :class="{ on: prefs.dailyNoteEnabled }"
            @click="toggle('dailyNoteEnabled')"
            :aria-checked="prefs.dailyNoteEnabled"
            role="switch"
          >
            <span class="toggle-thumb" />
          </button>
        </div>

        <div v-if="prefs.dailyNoteEnabled" class="setting-row">
          <div class="setting-info">
            <span class="setting-label">File path pattern</span>
            <span class="setting-desc">Use <code>YYYY</code>, <code>MM</code>, <code>DD</code> as date tokens. The <code>.md</code> extension is added automatically.</span>
          </div>
          <input
            class="tz-input pattern-input"
            type="text"
            v-model="prefs.dailyNotePattern"
            placeholder="Daily Notes/YYYY/MM/YYYY-MM-DD"
            @change="save"
          />
        </div>
      </section>

      <section class="settings-section">
        <h2>Quick Links</h2>
        <div class="divider" />

        <div
          v-for="link in links"
          :key="link.id"
          class="setting-row ql-row"
        >
          <div class="setting-info">
            <span class="setting-label">{{ link.label }}</span>
            <span class="setting-desc ql-url">{{ link.url }}</span>
          </div>

          <div v-if="confirmDeleteId !== link.id" class="ql-actions">
            <button class="icon-btn" :aria-label="'Edit ' + link.label" @click="editLinkTarget = link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="icon-btn icon-btn--danger" :aria-label="'Delete ' + link.label" @click="confirmDeleteId = link.id">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
            </button>
          </div>

          <div v-else class="ql-confirm-delete">
            <span>Delete?</span>
            <button class="btn-confirm" @click="doDeleteLink(link.id)">Confirm</button>
            <button class="btn-cancel-sm" @click="confirmDeleteId = null">Cancel</button>
          </div>
        </div>

        <div v-if="links.length === 0" class="ql-empty">
          No quick links yet.
        </div>

        <button class="btn-add-link" @click="showAddLink = true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="btn-add-icon">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Link
        </button>
      </section>
    </div>

    <QuickLinkModal
      v-if="showAddLink"
      @save="onLinkSaved"
      @cancel="showAddLink = false"
    />
    <QuickLinkModal
      v-if="editLinkTarget"
      :link="editLinkTarget"
      @save="onLinkSaved"
      @cancel="editLinkTarget = null"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getPreferences, updatePreferences, deleteQuickLink } from '../api.js';
import { useToast } from '../composables/useToast.js';
import { useQuickLinks } from '../composables/useQuickLinks.js';
import QuickLinkModal from '../components/QuickLinkModal.vue';

const prefs = ref({ enterToAdd: true, timezone: '', dailyNoteLinks: false, dailyNoteEnabled: false, dailyNotePattern: '' });
const vaultPath = ref('');
const { show } = useToast();
const { links, load: loadLinks } = useQuickLinks();

const showAddLink = ref(false);
const editLinkTarget = ref(null);
const confirmDeleteId = ref(null);

onMounted(async () => {
  prefs.value = await getPreferences();
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
  await updatePreferences({
    enterToAdd: prefs.value.enterToAdd,
    timezone: prefs.value.timezone,
    dailyNoteLinks: prefs.value.dailyNoteLinks,
    dailyNoteEnabled: prefs.value.dailyNoteEnabled,
    dailyNotePattern: prefs.value.dailyNotePattern,
  });
  show('Settings saved');
}

async function onLinkSaved() {
  showAddLink.value = false;
  editLinkTarget.value = null;
  await loadLinks();
}

async function doDeleteLink(id) {
  await deleteQuickLink(id);
  confirmDeleteId.value = null;
  await loadLinks();
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

.pattern-input { width: 300px; }

.setting-desc code {
  font-family: monospace;
  font-size: 12px;
  background: #F1F5F9;
  padding: 1px 5px;
  border-radius: 4px;
  color: #0F172A;
}

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

/* Quick Links section */
.ql-row { align-items: center; }

.ql-url {
  word-break: break-all;
}

.ql-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.icon-btn {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: none;
  color: #94A3B8;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn:hover { background: #F1F5F9; color: #475569; }

.icon-btn--danger:hover { background: #FEF2F2; color: #EF4444; }

.icon-btn svg { width: 15px; height: 15px; }

.ql-confirm-delete {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #991B1B;
  flex-shrink: 0;
}

.btn-confirm {
  height: 30px;
  padding: 0 12px;
  border-radius: 6px;
  background: #EF4444;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
}

.btn-cancel-sm {
  height: 30px;
  padding: 0 12px;
  border-radius: 6px;
  background: #fff;
  border: 1px solid #FCA5A5;
  color: #EF4444;
  font-size: 13px;
  font-weight: 600;
}

.ql-empty {
  font-size: 14px;
  color: #94A3B8;
  padding: 16px 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 4px #0F172210;
}

.btn-add-link {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 20px;
  border-radius: 8px;
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  color: #475569;
  font-weight: 600;
  font-size: 14px;
  align-self: flex-start;
}

.btn-add-link:hover { background: #F1F5F9; }

.btn-add-icon { width: 16px; height: 16px; }
</style>
