<template>
  <div class="modal-backdrop" @click.self="$emit('cancel')">
    <div class="modal">
      <div class="modal-header">
        <h2>Add Project</h2>
        <button class="close-btn" @click="$emit('cancel')">✕</button>
      </div>
      <div class="modal-divider" />

      <form class="modal-body" @submit.prevent="save">
        <div class="field">
          <label>Project Name</label>
          <input v-model="form.name" type="text" placeholder="e.g. SOE" required />
        </div>
        <div class="field">
          <label>Vault-relative File Path</label>
          <input v-model="form.filePath" type="text" placeholder="Projects/SOE.md" required />
          <span class="hint">Relative to your vault root. Must end in .md</span>
          <span v-if="error" class="field-error">{{ error }}</span>
        </div>
      </form>

      <div class="modal-footer">
        <button type="button" class="btn-cancel" @click="$emit('cancel')">Cancel</button>
        <button class="btn-save" :disabled="saving" @click="save">
          {{ saving ? 'Saving…' : 'Save Project' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { createProject } from '../api.js';

const emit = defineEmits(['save', 'cancel']);

const form = ref({ name: '', filePath: '' });
const error = ref('');
const saving = ref(false);

async function save() {
  error.value = '';
  if (!form.value.name.trim() || !form.value.filePath.trim()) {
    error.value = 'Both fields are required.';
    return;
  }
  if (!form.value.filePath.trim().endsWith('.md')) {
    error.value = 'File path must end in .md';
    return;
  }
  saving.value = true;
  try {
    const project = await createProject({ name: form.value.name, filePath: form.value.filePath });
    emit('save', project);
  } catch (e) {
    error.value = e.message;
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: #0F172240;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  background: #fff;
  border-radius: 16px;
  width: 480px;
  box-shadow: 0 8px 32px #0F172230;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
}

.modal-header h2 { font-size: 18px; font-weight: 700; }

.close-btn {
  background: none;
  color: #94A3B8;
  font-size: 16px;
  line-height: 1;
}

.close-btn:hover { color: #475569; }

.modal-divider { height: 1px; background: #E2E8F0; }

.modal-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.field { display: flex; flex-direction: column; gap: 6px; }

.field label { font-size: 14px; font-weight: 600; color: #374151; }

.field input {
  height: 44px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  background: #F8FAFC;
  padding: 0 14px;
  color: #0F172A;
}

.field input:focus { border-color: #10B981; background: #fff; }

.hint { font-size: 12px; color: #94A3B8; }

.field-error { font-size: 12px; color: #EF4444; }

.modal-footer {
  padding: 16px 24px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-cancel {
  height: 40px;
  padding: 0 20px;
  border-radius: 8px;
  background: #F1F5F9;
  border: 1px solid #E2E8F0;
  color: #475569;
  font-weight: 600;
}

.btn-cancel:hover { background: #E2E8F0; }

.btn-save {
  height: 40px;
  padding: 0 24px;
  border-radius: 8px;
  background: #10B981;
  color: #fff;
  font-weight: 600;
}

.btn-save:hover:not(:disabled) { background: #059669; }
.btn-save:disabled { opacity: 0.6; cursor: not-allowed; }
</style>
