<template>
  <div class="note-editor">
    <div class="editor-header">
      <input
        v-model="localNote.title"
        type="text"
        placeholder="Note title..."
        class="title-input"
        @input="handleTitleChange"
      />
      <div class="editor-actions">
        <button
          @click="saveNote"
          :disabled="!isNoteValid || isSaving"
          class="save-btn"
        >
          {{ isSaving ? 'Saving...' : 'Save' }}
        </button>
        <button
          @click="cancelEdit"
          class="cancel-btn"
        >
          Cancel
        </button>
      </div>
    </div>

    <div class="editor-toolbar">
      <div class="formatting-buttons">
        <button
          @click="formatText('bold')"
          class="format-btn"
          :class="{ active: isFormatActive('bold') }"
          title="Bold"
        >
          <strong>B</strong>
        </button>
        <button
          @click="formatText('italic')"
          class="format-btn"
          :class="{ active: isFormatActive('italic') }"
          title="Italic"
        >
          <em>I</em>
        </button>
        <button
          @click="formatText('underline')"
          class="format-btn"
          :class="{ active: isFormatActive('underline') }"
          title="Underline"
        >
          <u>U</u>
        </button>
        <div class="separator"></div>
        <button
          @click="insertList('ul')"
          class="format-btn"
          title="Bullet List"
        >
          •
        </button>
        <button
          @click="insertList('ol')"
          class="format-btn"
          title="Numbered List"
        >
          1.
        </button>
      </div>
      
      <div class="editor-info">
        <span class="word-count">{{ wordCount }} words</span>
        <span class="char-count">{{ charCount }} characters</span>
      </div>
    </div>

    <div class="editor-content">
      <div
        ref="contentEditor"
        class="content-input"
        contenteditable="true"
        @input="handleContentChange"
        @keydown="handleKeyDown"
        @paste="handlePaste"
        placeholder="Start writing your note..."
      ></div>
    </div>

    <div class="editor-footer">
      <div class="note-metadata">
        <span v-if="localNote.createdAt" class="created-date">
          Created: {{ formatDate(localNote.createdAt) }}
        </span>
        <span v-if="localNote.updatedAt" class="updated-date">
          Last updated: {{ formatDate(localNote.updatedAt) }}
        </span>
      </div>
      
      <div class="tags-section">
        <label class="tags-label">Tags:</label>
        <div class="tags-container">
          <span
            v-for="tag in localNote.tags"
            :key="tag"
            class="tag"
          >
            {{ tag }}
            <button
              @click="removeTag(tag)"
              class="remove-tag"
            >
              ×
            </button>
          </span>
          <input
            v-model="newTag"
            @keydown.enter="addTag"
            @keydown.comma="addTag"
            type="text"
            placeholder="Add tag..."
            class="tag-input"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import type { Note } from '@/types/Note'

interface Props {
  note?: Note | null
  isEditing?: boolean
}

interface Emits {
  (e: '