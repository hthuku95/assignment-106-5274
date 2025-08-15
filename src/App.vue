<template>
  <div id="app">
    <Header @toggle-sidebar="toggleSidebar" />
    <div class="app-container">
      <Sidebar 
        :is-open="sidebarOpen" 
        @close="closeSidebar"
        @note-selected="selectNote"
        @new-note="createNewNote"
      />
      <main class="main-content" :class="{ 'sidebar-open': sidebarOpen }">
        <router-view 
          :key="$route.fullPath"
          @note-updated="handleNoteUpdate"
        />
      </main>
    </div>
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, provide } from 'vue'
import { useRouter } from 'vue-router'
import Header from '@/components/Header.vue'
import Sidebar from '@/components/Sidebar.vue'
import Toast from '@/components/Toast.vue'
import { useNotesStore } from '@/stores/notes'
import { useToastStore } from '@/stores/toast'
import type { Note } from '@/types/note'

const router = useRouter()
const notesStore = useNotesStore()
const toastStore = useToastStore()

const sidebarOpen = ref(false)

const toggleSidebar = (): void => {
  sidebarOpen.value = !sidebarOpen.value
}

const closeSidebar = (): void => {
  sidebarOpen.value = false
}

const selectNote = (note: Note): void => {
  router.push(`/note/${note.id}`)
  if (window.innerWidth < 768) {
    closeSidebar()
  }
}

const createNewNote = (): void => {
  const newNote = notesStore.createNote()
  router.push(`/note/${newNote.id}`)
  if (window.innerWidth < 768) {
    closeSidebar()
  }
}

const handleNoteUpdate = (note: Note): void => {
  notesStore.updateNote(note.id, note)
}

const handleResize = (): void => {
  if (window.innerWidth >= 768) {
    sidebarOpen.value = true
  } else {
    sidebarOpen.value = false
  }
}

onMounted(async () => {
  try {
    await notesStore.loadNotes()
    handleResize()
    window.addEventListener('resize', handleResize)
    
    // Navigate to first note if no route is specified
    if (router.currentRoute.value.path === '/' && notesStore.notes.length > 0) {
      router.push(`/note/${notesStore.notes[0].id}`)
    }
  } catch (error) {
    console.error('Failed to initialize app:', error)
    toastStore.showError('Failed to load notes')
  }
})

// Provide global app state
provide('sidebarOpen', sidebarOpen)
provide('toggleSidebar', toggleSidebar)
</script>

<style scoped>
#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

.app-container {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  transition: margin-left 0.3s ease;
}

@media (max-width: 767px) {
  .main-content.sidebar-open {
    margin-left: 0;
  }
}

@media (min-width: 768px) {
  .main-content {