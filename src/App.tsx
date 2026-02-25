import { useRef } from 'react';
import { useNotes } from './hooks/useNotes';
import { useTheme } from './hooks/useTheme';
import { useResizable } from './hooks/useResizable';
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

  const contentRef = useRef<HTMLDivElement>(null);

  // 可拖拽面板尺寸
  const sidebar = useResizable({
    initialSize: 288,
    minSize: 220,
    maxSize: 480,
    direction: 'left',
    storageKey: 'panel-sidebar-width',
  });

  const preview = useResizable({
    initialSize: 50,
    minSize: 25,
    maxSize: 75,
    direction: 'right',
    storageKey: 'panel-preview-pct',
    containerRef: contentRef,
  });

  return (
    <div
      className="flex h-screen w-screen overflow-hidden"
      style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      {/* 左侧：笔记列表 + 文件夹 + 主题切换 */}
      <div style={{ width: sidebar.size, flexShrink: 0 }}>
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
      </div>

      {/* 拖拽手柄 — 侧边栏 | 编辑器 */}
      <div
        className="drag-handle"
        onMouseDown={sidebar.handleMouseDown}
      />

      {/* 中间+右侧 内容区域 */}
      <div ref={contentRef} className="flex-1 flex min-w-0 overflow-hidden">
        {/* 编辑器 */}
        <div style={{ flex: `${100 - preview.size} 0 0%` }} className="min-w-0 overflow-hidden">
          <Editor note={activeNote} onUpdateNote={updateNote} />
        </div>

        {/* 拖拽手柄 — 编辑器 | 预览 */}
        <div
          className="drag-handle"
          onMouseDown={preview.handleMouseDown}
        />

        {/* 预览 */}
        <div style={{ flex: `${preview.size} 0 0%` }} className="min-w-0 overflow-hidden flex">
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
      </div>
    </div>
  );
}

export default App;
