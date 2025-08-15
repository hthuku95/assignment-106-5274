<template>
  <div class="note-card" :class="{ 'editing': isEditing }">
    <div v-if="!isEditing" class="note-content">
      <h3 class="note-title">{{ note.title }}</h3>
      <p class="note-body">{{ note.content }}</p>
      <div class="note-meta">
        <span class="note-date">{{ formattedDate }}</span>
        <div class="note-actions">
          <button @click="startEdit" class="btn-edit" title="Edit note">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button @click="deleteNote" class="btn-delete" title="Delete note">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3,6 5,6 21,6"/>
              <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1 2-2h4a2,2 0 0,1 2,2v2"/>
              <line x1="10" y1="11" x2="10" y2="17"/>
              <line x1="14" y1="11" x2="14" y2="17"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div v-else class="note-edit">
      <input
        v-model="editTitle"
        @keyup.enter="saveEdit"
        @keyup.escape="cancelEdit"
        class="edit-title"
        placeholder="Note title..."
        ref="titleInput"
      />
      <textarea
        v-model="editContent"
        @keyup.ctrl.enter="saveEdit"
        @keyup.escape="cancelEdit"
        class="edit-content"
        placeholder="Write your note here..."
        rows="4"
        ref="contentTextarea"
      ></textarea>
      <div class="edit-actions">
        <button @click="saveEdit" class="btn-save">Save</button>
        <button @click="cancelEdit" class="btn-cancel">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import type { Note } from '../types/Note'

interface Props {
  note: Note
}

interface Emits {
  (e: 'update', note: Note): void
  (e: 'delete', id: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isEditing = ref(false)
const editTitle = ref('')
const editContent = ref('')
const titleInput = ref<HTMLInputElement>()
const contentTextarea = ref<HTMLTextAreaElement>()

const formattedDate = computed(() => {
  return new Date(props.note.updatedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})

const startEdit = async (): Promise<void> => {
  isEditing.value = true
  editTitle.value = props.note.title
  editContent.value = props.