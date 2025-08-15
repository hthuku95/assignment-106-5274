<template>
  <div class="search-bar">
    <div class="search-input-container">
      <svg 
        class="search-icon" 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2"
      >
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.35-4.35"></path>
      </svg>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search notes..."
        class="search-input"
        @input="handleSearch"
        @keyup.escape="clearSearch"
      />
      <button
        v-if="searchQuery"
        @click="clearSearch"
        class="clear-button"
        aria-label="Clear search"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
    <div v-if="searchQuery && searchResults !== null" class="search-results-info">
      {{ searchResults }} {{ searchResults === 1 ? 'note' : 'notes' }} found
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineEmits } from 'vue'

interface SearchEmits {
  search: [query: string]
  clear: []
}

interface Props {
  searchResults?: number | null
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  searchResults: null,
  placeholder: 'Search notes...'
})

const emit = defineEmits<SearchEmits>()

const searchQuery = ref<string>('')

let searchTimeout: NodeJS.Timeout | null = null

const handleSearch = (): void => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  
  searchTimeout = setTimeout(() => {
    emit('search', searchQuery.value.trim())
  }, 300)
}

const clearSearch = (): void => {
  searchQuery.value = ''
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  emit('clear')
}

watch(() => searchQuery.value, (newValue) => {
  if (!newValue.trim()) {
    emit('clear')
  }
})

defineExpose({
  clearSearch,
  searchQuery
})
</script>

<style scoped>
.search-bar {
  width: 100%;
  margin-bottom: 1rem;
}

.search-input-container {
  position: relative;
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.search-input-container:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-icon {
  position: absolute;
  left: 12px;
  color: #6b7280;
  pointer-events: none;
  z-index: 1;
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 44px;
  border: none;
  outline: none;
  font-size: 16px;
  color: #374151;
  background: transparent;
  border-radius: 12px;
}

.search-input::