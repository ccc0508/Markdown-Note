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
    onImport: () => void;
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
    onImport,
}: NoteListProps) {
    return (
        <aside className="w-72 min-w-[260px] bg-[#0f1117] border-r border-white/10 flex flex-col h-full">
            {/* 头部：Logo + 新建按钮 */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </div>
                    <h1 className="text-sm font-semibold text-slate-200 tracking-wide">Markdown Notes</h1>
                </div>
                <button
                    id="create-note-btn"
                    onClick={onCreateNote}
                    className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 hover:text-indigo-300 transition-all duration-200"
                    title="新建笔记"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </button>
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
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <p className="text-sm text-slate-500">
                            {searchQuery ? '暂无匹配笔记' : '暂无笔记'}
                        </p>
                        {!searchQuery && (
                            <p className="text-xs text-slate-600 mt-1">
                                点击上方 + 创建第一篇笔记
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* 底部操作栏 */}
            <div className="p-2 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-1">
                    {/* 导入 */}
                    <button
                        id="import-notes-btn"
                        onClick={onImport}
                        className="p-1.5 rounded-md text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all duration-200"
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
                        className="p-1.5 rounded-md text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all duration-200"
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
                        className="p-1.5 rounded-md text-slate-500 hover:text-amber-400 hover:bg-amber-500/10 transition-all duration-200"
                        title="导出全部笔记 (.json)"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                    </button>
                </div>
                <span className="text-xs text-slate-600">{notes.length} 篇笔记</span>
            </div>
        </aside>
    );
});
