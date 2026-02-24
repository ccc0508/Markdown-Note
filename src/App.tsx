import { useNotes } from './hooks/useNotes';
import { useTheme } from './hooks/useTheme';
import { NoteList } from './components/NoteList/NoteList';
import { Editor } from './components/Editor/Editor';
import { Preview } from './components/Preview/Preview';
import { TableOfContents } from './components/Preview/TableOfContents';
import { ThemeSwitcher } from './components/ThemeSwitcher/ThemeSwitcher';

function App() {
  const {
    notes,
    allNotes,
    activeNote,
    activeNoteId,
    searchQuery,
    setSearchQuery,
    setActiveNoteId,
    createNote,
    updateNote,
    deleteNote,
    moveNoteToFolder,
    exportCurrentNote,
    exportAllNotes,
    exportPdf,
    importNotes,
    folders,
    activeFolderId,
    setActiveFolderId,
    createFolder,
    renameFolder,
    deleteFolder,
  } = useNotes();

  const { currentTheme, themes, setTheme } = useTheme();

  return (
    <div
      className="flex h-screen w-screen overflow-hidden"
      style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      {/* 左侧：笔记列表 + 文件夹 + 主题切换 */}
      <NoteList
        notes={notes}
        allNotes={allNotes}
        activeNoteId={activeNoteId}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectNote={setActiveNoteId}
        onCreateNote={createNote}
        onDeleteNote={deleteNote}
        onExportCurrent={exportCurrentNote}
        onExportAll={exportAllNotes}
        onExportPdf={exportPdf}
        onImport={importNotes}
        onMoveNoteToFolder={moveNoteToFolder}
        folders={folders}
        activeFolderId={activeFolderId}
        onSelectFolder={setActiveFolderId}
        onCreateFolder={createFolder}
        onRenameFolder={renameFolder}
        onDeleteFolder={deleteFolder}
        themeSwitcher={
          <ThemeSwitcher
            currentTheme={currentTheme}
            themes={themes}
            onThemeChange={setTheme}
          />
        }
      />

      {/* 中间：编辑器 */}
      <Editor note={activeNote} onUpdateNote={updateNote} />

      {/* 分隔线 */}
      <div className="w-px flex-shrink-0" style={{ backgroundColor: 'var(--border-color)' }} />

      {/* 右侧：预览 + 目录 */}
      <Preview
        content={activeNote?.content ?? ''}
        title={activeNote?.title ?? ''}
        onContentChange={(newContent) => {
          if (activeNote) {
            updateNote(activeNote.id, { content: newContent });
          }
        }}
      />

      {/* 目录导航 */}
      {activeNote && (
        <TableOfContents content={activeNote.content} />
      )}
    </div>
  );
}

export default App;
