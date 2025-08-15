import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useNotesStore } from '@/stores/notesStore'

describe('Notes Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('Initial State', () => {
    it('should have empty notes array initially', () => {
      const store = useNotesStore()
      expect(store.notes).toEqual([])
    })

    it('should have null selected note initially', () => {
      const store = useNotesStore()
      expect(store.selectedNote).toBeNull()
    })

    it('should have empty search query initially', () => {
      const store = useNotesStore()
      expect(store.searchQuery).toBe('')
    })
  })

  describe('Getters', () => {
    it('should return filtered notes based on search query', () => {
      const store = useNotesStore()
      store.notes = [
        { id: '1', title: 'Meeting Notes', content: 'Important meeting', createdAt: new Date(), updatedAt: new Date() },
        { id: '2', title: 'Shopping List', content: 'Buy groceries', createdAt: new Date(), updatedAt: new Date() },
        { id: '3', title: 'Project Ideas', content: 'New app concepts', createdAt: new Date(), updatedAt: new Date() }
      ]
      
      store.searchQuery = 'meeting'
      expect(store.filteredNotes).toHaveLength(1)
      expect(store.filteredNotes[0].title).toBe('Meeting Notes')
    })

    it('should return all notes when search query is empty', () => {
      const store = useNotesStore()
      store.notes = [
        { id: '1', title: 'Note 1', content: 'Content 1', createdAt: new Date(), updatedAt: new Date() },
        { id: '2', title: 'Note 2', content: 'Content 2', createdAt: new Date(), updatedAt: new Date() }
      ]
      
      store.searchQuery = ''
      expect(store.filteredNotes).toHaveLength(2)
    })

    it('should search in both title and content', () => {
      const store = useNotesStore()
      store.notes = [
        { id: '1', title: 'Meeting', content: 'Important discussion', createdAt: new Date(), updatedAt: new Date() },
        { id: '2', title: 'Shopping', content: 'Meeting at store', createdAt: new Date(), updatedAt: new Date() },
        { id: '3', title: 'Project', content: 'Development tasks', createdAt: new Date(), updatedAt: new Date() }
      ]
      
      store.searchQuery = 'meeting'
      expect(store.filteredNotes).toHaveLength(2)
    })

    it('should return notes count', () => {
      const store = useNotesStore()
      store.notes = [
        { id: '1', title: 'Note 1', content: 'Content 1', createdAt: new Date(), updatedAt: new Date() },
        { id: '2', title: 'Note 2', content: 'Content 2', createdAt: new Date(), updatedAt: new Date() }
      ]
      
      expect(store.notesCount).toBe(2)
    })
  })

  describe('Actions', () => {
    describe('addNote', () => {
      it('should add a new note', () => {
        const store = useNotesStore()
        const noteData = { title: 'New Note', content: 'New content' }
        
        store.addNote(noteData)
        
        expect(store.notes).toHaveLength(1)
        expect(store.notes[0].title).toBe('New Note')
        expect(store.notes[0].content).toBe('New content')
        expect(store.notes[