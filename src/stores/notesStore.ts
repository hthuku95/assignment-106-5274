import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
  isPinned: boolean
  isArchived: boolean
}

export interface NoteFilters {
  search: string
  tags: string[]
  showArchived: boolean
  showPinned: boolean
}

export const useNotesStore = defineStore('notes', () => {
  // State
  const notes = ref<Note[]>([])
  const filters = ref<NoteFilters>({
    search: '',
    tags: [],
    showArchived: false,
    showPinned: false
  })
  const selectedNoteId = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const filteredNotes = computed(() => {
    let filtered = notes.value

    // Filter by archived status
    if (!filters.value.showArchived) {
      filtered = filtered.filter(note => !note.isArchived)
    }

    // Filter by pinned status
    if (filters.value.showPinned) {
      filtered = filtered.filter(note => note.isPinned)
    }

    // Filter by search term
    if (filters.value.search) {
      const searchTerm = filters.value.search.toLowerCase()
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(searchTerm) ||
        note.content.toLowerCase().includes(searchTerm)
      )
    }

    // Filter by tags
    if (filters.value.tags.length > 0) {
      filtered = filtered.filter(note =>
        filters.value.tags.every(tag => note.tags.includes(tag))
      )
    }

    // Sort by pinned first, then by updated date
    return filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })
  })

  const selectedNote = computed(() => {
    if (!selectedNoteId.value) return null
    return notes.value.find(note => note.id === selectedNoteId.value) || null
  })

  const allTags = computed(() => {
    const tagSet = new Set<string>()
    notes.value.forEach(note => {
      note.tags.forEach(tag => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
  })

  const pinnedNotes = computed(() => {
    return notes.value.filter(note => note.isPinned && !note.isArchived)
  })

  const archivedNotes = computed(() => {
    return notes.value.filter(note => note.isArchived)
  })

  const totalNotes = computed(() => {
    return notes.value.filter(note => !note.isArchived).length
  })

  // Actions
  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  const createNote = (noteData: Partial<Note>): Note => {
    try {
      isLoading.value = true
      error.value = null

      const newNote: Note = {
        id: generateId(),
        title: noteData.title || 'Untitled',
        content: noteData.content || '',
        tags: noteData.tags || [],
        createdAt: new Date(),
        updatedAt: new Date(),
        isPinned: noteData.isPinned || false,
        isArchived: false
      }

      notes.value.unshift(newNote)
      selectedNoteId.value = newNote.id
      saveToLocalStorage()

      return newNote
    } catch (err) {
      error.value = 'Failed to