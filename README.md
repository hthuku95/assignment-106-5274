# Note Taking Application

A modern, feature-rich note-taking application built with Vue.js and TypeScript. This application provides an intuitive interface for creating, editing, organizing, and managing your notes with a clean and responsive design.

## Features

- **Create and Edit Notes**: Rich text editing capabilities with markdown support
- **Organize Notes**: Categorize and tag your notes for easy organization
- **Search Functionality**: Quickly find notes using full-text search
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Local Storage**: Notes are automatically saved to your browser's local storage
- **Export Options**: Export notes to various formats (PDF, Markdown, TXT)
- **Dark/Light Theme**: Toggle between dark and light themes
- **TypeScript Support**: Full type safety and enhanced development experience

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 16.0 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) package manager
- A modern web browser (Chrome, Firefox, Safari, Edge)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/note-taking-app.git
   cd note-taking-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

## Project Structure

```
note-taking-app/
├── public/
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── components/
│   │   ├── NoteEditor.vue
│   │   ├── NoteList.vue
│   │   ├── SearchBar.vue
│   │   └── ThemeToggle.vue
│   ├── composables/
│   │   ├── useNotes.ts
│   │   ├── useSearch.ts
│   │   └── useTheme.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── storage.ts
│   │   └── export.ts
│   ├── styles/
│   │   └── main.css
│   ├── App.vue
│   └── main.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Usage

### Creating a New Note

1. Click the "New Note" button in the top navigation
2. Enter a title for your note
3. Start typing in the editor area
4. Your note will be automatically saved as you type

### Editing Notes

1. Click on any note from the notes list
2. The note will open in the editor
3. Make your changes
4. Changes are saved automatically

### Organizing Notes

- **Tags**: Add tags to your notes by typing `#tag` in the note content
- **Categories**: Assign categories using the dropdown menu in the note editor
- **Search**: Use the search bar to find notes by title, content, or tags

### Keyboard Shortcuts

- `Ctrl + N` (or `Cmd + N` on Mac): Create new note
- `Ctrl + S` (or `Cmd + S` on Mac): Save current note
- `Ctrl + F` (or `Cmd + F` on Mac): Focus search bar
- `Ctrl + D` (or `Cmd + D` on Mac): Delete current note
- `Ctrl + E` (or `Cmd + E` on Mac): Export current note

## API Reference

### Note Interface

```typescript
interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  category: string;
  createdAt: Date;
  updatedAt: Date;
  isPinned: boolean;
}
```

### useNotes Composable

```typescript
const {
  notes,
  currentNote,
  createNote,
  updateNote,
  delete