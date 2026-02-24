import React from 'react';
import type { Note } from '../../types/note';
import { SearchBar } from './SearchBar';
import { NoteItem } from './NoteItem';

interface NoteListProps {
    notes: Note[];
    activeNoteId: string | null;
    searchQuery: string;
    onSearchChange: (value: string) => void;
    onSelectNote: (id: string) => void;
    onCreateNote: () => void;
    onDeleteNote: (id: string) => void;
    onExportCurrent: () => void;
    onExportAll: () => void;
    onExportPdf: () => void;
    onImport: () => void;
    themeSwitcher?: React.ReactNode;
}

export const NoteList = React.memo(function NoteList({
    notes,
    activeNoteId,
    searchQuery,
    onSearchChange,
    onSelectNote,
    onCreateNote,
    onDeleteNote,
    onExportCurrent,
    onExportAll,
    onExportPdf,
    onImport,
    themeSwitcher,
}: NoteListProps) {
    return (
        <aside
            className="w-72 min-w-[260px] flex flex-col h-full"
            style={{
                backgroundColor: 'var(--bg-sidebar)',
                borderRight: '1px solid var(--border-color)',
            }}
        >
            {/* 头部：Logo + 主题 + 新建按钮 */}
            <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-color)' }}>
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))' }}>
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </div>
                    <h1 className="text-sm font-semibold tracking-wide" style={{ color: 'var(--text-primary)' }}>Markdown Notes</h1>
                </div>
                <div className="flex items-center gap-1">
                    {themeSwitcher}
                    <button
                        id="create-note-btn"
                        onClick={onCreateNote}
                        className="p-1.5 rounded-lg transition-all duration-200"
                        style={{
                            backgroundColor: 'var(--accent-bg)',
                            color: 'var(--accent)',
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--active-bg)';
                            (e.currentTarget as HTMLElement).style.color = 'var(--accent-hover)';
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--accent-bg)';
                            (e.currentTarget as HTMLElement).style.color = 'var(--accent)';
                        }}
                        title="新建笔记"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* 搜索栏 */}
            <SearchBar value={searchQuery} onChange={onSearchChange} />

            {/* 笔记列表 */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {notes.length > 0 ? (
                    notes.map((note) => (
                        <NoteItem
                            key={note.id}
                            note={note}
                            isActive={note.id === activeNoteId}
                            onSelect={onSelectNote}
                            onDelete={onDeleteNote}
                        />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--hover-bg)' }}>
                            <svg className="w-8 h-8" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                            {searchQuery ? '暂无匹配笔记' : '暂无笔记'}
                        </p>
                        {!searchQuery && (
                            <p className="text-xs mt-1" style={{ color: 'var(--text-placeholder)' }}>
                                点击上方 + 创建第一篇笔记
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* 底部操作栏 */}
            <div className="p-2 flex items-center justify-between" style={{ borderTop: '1px solid var(--border-color)' }}>
                <div className="flex items-center gap-1">
                    {/* 导入 */}
                    <button
                        id="import-notes-btn"
                        onClick={onImport}
                        className="p-1.5 rounded-md transition-all duration-200"
                        style={{ color: 'var(--text-muted)' }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.color = '#34d399';
                            (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(52, 211, 153, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
                            (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                        }}
                        title="导入笔记 (.md / .json)"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                    </button>
                    {/* 导出当前 */}
                    <button
                        id="export-current-btn"
                        onClick={onExportCurrent}
                        className="p-1.5 rounded-md transition-all duration-200"
                        style={{ color: 'var(--text-muted)' }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.color = 'var(--accent)';
                            (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--accent-bg)';
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
                            (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                        }}
                        title="导出当前笔记 (.md)"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                    </button>
                    {/* 导出全部 */}
                    <button
                        id="export-all-btn"
                        onClick={onExportAll}
                        className="p-1.5 rounded-md transition-all duration-200"
                        style={{ color: 'var(--text-muted)' }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.color = '#fbbf24';
                            (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(251, 191, 36, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
                            (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                        }}
                        title="导出全部笔记 (.json)"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                    </button>
                    {/* 导出 PDF */}
                    <button
                        id="export-pdf-btn"
                        onClick={onExportPdf}
                        className="p-1.5 rounded-md transition-all duration-200"
                        style={{ color: 'var(--text-muted)' }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.color = '#fb7185';
                            (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(251, 113, 133, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
                            (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                        }}
                        title="导出为 PDF"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                    </button>
                </div>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{notes.length} 篇笔记</span>
            </div>
        </aside>
    );
});
