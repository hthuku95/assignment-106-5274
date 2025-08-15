<template>
  <div class="notes-list">
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading notes...</p>
    </div>

    <div v-else-if="notes.length === 0" class="empty-state">
      <div class="empty-icon">📝</div>
      <h3>No notes yet</h3>
      <p>Create your first note to get started</p>
    </div>

    <div v-else class="notes-container">
      <div class="view-controls">
        <button 
          :class="['view-btn', { active: viewMode === 'grid' }]"
          @click="setViewMode('grid')"
          aria-label="Grid view"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z"/>
          </svg>
        </button>
        <button 
          :class="['view-btn', { active: viewMode === 'list' }]"
          @click="setViewMode('list')"
          aria-label="List view"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
          </svg>
        </button>
      </div>

      <TransitionGroup 
        :name="viewMode === 'grid' ? 'grid-item' : 'list-item'"
        tag="div" 
        :class="['notes-grid', viewMode]"
      >
        <div
          v-for="note in sortedNotes"
          :key="note.id"
          :class="['note-card', { selected: selectedNotes.includes(note.id) }]"
          @click="selectNote(note)"
          @contextmenu.prevent="showContextMenu($event, note)"
        >
          <div class="note-header">
            <h3 class="note-title" :title="note.title">
              {{ note.title || 'Untitled' }}
            </h3>
            <div class="note-actions">
              <button 
                v-if="note.isPinned"
                class="pin-btn pinned"
                @click.stop="togglePin(note)"
                aria-label="Unpin note"
              >
                📌
              </button>
              <button 
                v-else
                class="pin-btn"
                @click.stop="togglePin(note)"
                aria-label="Pin note"
              >
                📍
              </button>
              <button 
                class="menu-btn"
                @click.stop="showNoteMenu($event, note)"
                aria-label="Note options"
              >
                ⋮
              </button>
            </div>
          </div>

          <div class="note-content" v-html="truncateContent(note.content)"></div>

          <div class="note-footer">
            <div class="note-tags" v-if="note.tags && note.tags.length > 0">
              <span 
                v-for="tag in note.tags.slice(0, 3)" 
                :key="tag"
                class="tag"
                :style="{ backgroundColor: getTagColor(tag) }"
              >
                {{ tag }}
              </span>
              <span v-if="note.tags.length > 3" class="tag-more">
                +{{ note.tags.length - 3 }}
              </span>