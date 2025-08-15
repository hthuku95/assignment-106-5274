import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import NoteCard from '@/components/NoteCard.vue'
import type { Note } from '@/types/Note'

describe('NoteCard.vue', () => {
  let mockNote: Note

  beforeEach(() => {
    mockNote = {
      id: '1',
      title: 'Test Note',
      content: 'This is a test note content',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-02'),
      tags: ['test', 'unit'],
      category: 'work'
    }
  })

  it('renders note title correctly', () => {
    const wrapper = mount(NoteCard, {
      props: { note: mockNote }
    })

    expect(wrapper.find('h3').text()).toBe('Test Note')
  })

  it('renders note content correctly', () => {
    const wrapper = mount(NoteCard, {
      props: { note: mockNote }
    })

    expect(wrapper.find('.note-content').text()).toBe('This is a test note content')
  })

  it('displays formatted creation date', () => {
    const wrapper = mount(NoteCard, {
      props: { note: mockNote }
    })

    expect(wrapper.find('.note-date').text()).toContain('Jan 1, 2023')
  })

  it('renders tags correctly', () => {
    const wrapper = mount(NoteCard, {
      props: { note: mockNote }
    })

    const tags = wrapper.findAll('.tag')
    expect(tags).toHaveLength(2)
    expect(tags[0].text()).toBe('test')
    expect(tags[1].text()).toBe('unit')
  })

  it('displays category when provided', () => {
    const wrapper = mount(NoteCard, {
      props: { note: mockNote }
    })

    expect(wrapper.find('.note-category').text()).toBe('work')
  })

  it('emits edit event when edit button is clicked', async () => {
    const wrapper = mount(NoteCard, {
      props: { note: mockNote }
    })

    await wrapper.find('.edit-btn').trigger('click')

    expect(wrapper.emitted().edit).toBeTruthy()
    expect(wrapper.emitted().edit[0]).toEqual([mockNote])
  })

  it('emits delete event when delete button is clicked', async () => {
    const wrapper = mount(NoteCard, {
      props: { note: mockNote }
    })

    await wrapper.find('.delete-btn').trigger('click')

    expect(wrapper.emitted().delete).toBeTruthy()
    expect(wrapper.emitted().delete[0]).toEqual([mockNote.id])
  })

  it('truncates long content with ellipsis', () => {
    const longContentNote = {
      ...mockNote,
      content: 'A'.repeat(200)
    }

    const wrapper = mount(NoteCard, {
      props: { note: longContentNote }
    })

    const contentElement = wrapper.find('.note-content')
    expect(contentElement.text().length).toBeLessThan(200)
    expect(contentElement.text()).toContain('...')
  })

  it('handles note without tags', () => {
    const noteWithoutTags = {
      ...mockNote,
      tags: []
    }

    const wrapper = mount(NoteCard, {
      props: { note: noteWithoutTags }
    })

    expect(wrapper.findAll('.tag')).toHaveLength(0)
  })

  it('handles note without category', () => {
    const noteWithoutCategory = {
      ...mockNote,
      category: undefined
    }

    const wrapper = mount(NoteCard, {
      props: { note: noteWithoutCategory }
    })

    expect(wrapper.find('.note-category').exists()).toBe(false)
  })

  it('applies correct CSS classes', () => {
    const