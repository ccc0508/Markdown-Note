import { useNotes } from './hooks/useNotes';
import { NoteList } from './components/NoteList/NoteList';
import { Editor } from './components/Editor/Editor';
import { Preview } from './components/Preview/Preview';
import { TableOfContents } from './components/Preview/TableOfContents';

function App() {
  const {
    notes,
    activeNote,
    activeNoteId,
    searchQuery,
    setSearchQuery,
    setActiveNoteId,
    createNote,
    updateNote,
    deleteNote,
    exportCurrentNote,
    exportAllNotes,
    exportPdf,
    importNotes,
  } = useNotes();

  return (
    <div className="flex h-screen w-screen bg-[#0d0f16] text-slate-200 overflow-hidden">
      {/* 左侧：笔记列表 */}
      <NoteList
        notes={notes}
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
      />

      {/* 中间：编辑器 */}
      <Editor note={activeNote} onUpdateNote={updateNote} />

      {/* 分隔线 */}
      <div className="w-px bg-white/10 flex-shrink-0" />

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

