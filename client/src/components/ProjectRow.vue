<template>
  <div class="project-row">
    <span class="drag-handle" title="Drag to reorder">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg>
    </span>

    <span class="project-name">{{ project.name }}</span>

    <div class="input-area">
      <input
        v-model="noteText"
        type="text"
        class="note-input"
        placeholder="Quick note…"
        @keydown.enter="onEnter"
      />
      <button class="btn-add" :disabled="!noteText.trim()" @click="submit">ADD</button>
      <button class="btn-list" @click="$emit('list')">LIST</button>
      <button class="btn-edit" title="Edit project" @click="$emit('edit')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  project: { type: Object, required: true },
  enterToAdd: { type: Boolean, default: true },
});

const emit = defineEmits(['add-note', 'list', 'edit']);

const noteText = ref('');

function onEnter() {
  if (props.enterToAdd) submit();
}

function submit() {
  if (!noteText.value.trim()) return;
  emit('add-note', noteText.value.trim());
  noteText.value = '';
}
</script>

<style scoped>
.project-row {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fff;
  border-radius: 12px;
  padding: 16px 20px;
  box-shadow: 0 1px 4px #0F172214;
}

.drag-handle {
  flex-shrink: 0;
  cursor: grab;
  color: #CBD5E1;
  display: flex;
  align-items: center;
}

.drag-handle:active { cursor: grabbing; }

.drag-handle svg { width: 16px; height: 16px; }

.project-name {
  flex-shrink: 0;
  width: 130px;
  font-weight: 700;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.input-area {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.note-input {
  flex: 1;
  height: 40px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  background: #F8FAFC;
  padding: 0 12px;
  min-width: 0;
}

.note-input:focus { border-color: #10B981; background: #fff; }

.btn-add {
  flex-shrink: 0;
  height: 40px;
  padding: 0 18px;
  border-radius: 8px;
  background: #10B981;
  color: #fff;
  font-weight: 600;
  font-size: 13px;
}

.btn-add:hover:not(:disabled) { background: #059669; }
.btn-add:disabled { opacity: 0.5; cursor: not-allowed; }

.btn-list {
  flex-shrink: 0;
  height: 40px;
  padding: 0 18px;
  border-radius: 8px;
  background: #F1F5F9;
  border: 1px solid #E2E8F0;
  color: #475569;
  font-weight: 600;
  font-size: 13px;
}

.btn-list:hover { background: #E2E8F0; }

.btn-edit {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: transparent;
  color: #94A3B8;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-edit:hover { background: #F1F5F9; color: #475569; }

.btn-edit svg { width: 16px; height: 16px; }
</style>
