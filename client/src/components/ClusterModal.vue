<template>
  <div class="modal-backdrop" @click.self="$emit('cancel')">
    <div class="modal">
      <div class="modal-header">
        <h2>{{ cluster ? 'Edit Cluster' : 'Add Cluster' }}</h2>
        <button class="close-btn" @click="$emit('cancel')">✕</button>
      </div>
      <div class="modal-divider" />

      <form class="modal-body" @submit.prevent="save">
        <div class="field">
          <label>Cluster Name</label>
          <input v-model="form.name" type="text" placeholder="e.g. Work" required />
          <span v-if="error" class="field-error">{{ error }}</span>
        </div>
      </form>

      <div class="modal-footer">
        <button
          v-if="cluster && !confirmDelete"
          type="button"
          class="btn-delete"
          @click="confirmDelete = true"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
          Delete Cluster
        </button>

        <div class="confirm-delete" v-if="cluster && confirmDelete">
          <span>Delete "{{ cluster.name }}"? Projects will become unclustered.</span>
          <button type="button" class="btn-confirm" @click="doDelete">Confirm</button>
          <button type="button" class="btn-cancel-sm" @click="confirmDelete = false">Cancel</button>
        </div>

        <div class="footer-right">
          <button type="button" class="btn-cancel" @click="$emit('cancel')">Cancel</button>
          <button class="btn-save" :disabled="saving" @click="save">
            {{ saving ? 'Saving…' : 'Save Cluster' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { createCluster, updateCluster, deleteCluster } from '../api.js';

const props = defineProps({
  cluster: { type: Object, default: null },
});
const emit = defineEmits(['save', 'delete', 'cancel']);

const form = ref({ name: props.cluster ? props.cluster.name : '' });
const error = ref('');
const saving = ref(false);
const confirmDelete = ref(false);

async function save() {
  error.value = '';
  if (!form.value.name.trim()) {
    error.value = 'Cluster name is required.';
    return;
  }
  saving.value = true;
  try {
    let result;
    if (props.cluster) {
      result = await updateCluster(props.cluster.id, { name: form.value.name });
    } else {
      result = await createCluster({ name: form.value.name });
    }
    emit('save', result);
  } catch (e) {
    error.value = e.message;
  } finally {
    saving.value = false;
  }
}

async function doDelete() {
  await deleteCluster(props.cluster.id);
  emit('delete', props.cluster.id);
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

.field-error { font-size: 12px; color: #EF4444; }

.modal-footer {
  padding: 16px 24px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.btn-delete {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 40px;
  padding: 0 16px;
  border-radius: 8px;
  background: #FEF2F2;
  color: #EF4444;
  font-weight: 600;
}

.btn-delete:hover { background: #FEE2E2; }
.btn-delete svg { width: 15px; height: 15px; }

.confirm-delete {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  background: #FEF2F2;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 13px;
  color: #991B1B;
  flex-wrap: wrap;
}

.btn-confirm {
  height: 32px;
  padding: 0 14px;
  border-radius: 6px;
  background: #EF4444;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  flex-shrink: 0;
}

.btn-cancel-sm {
  height: 32px;
  padding: 0 14px;
  border-radius: 6px;
  background: #fff;
  border: 1px solid #FCA5A5;
  color: #EF4444;
  font-size: 13px;
  font-weight: 600;
  flex-shrink: 0;
}

.footer-right { display: flex; gap: 10px; margin-left: auto; }

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
