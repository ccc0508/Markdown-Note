import React, { useState, useRef, useEffect } from 'react';
import type { Note, Folder } from '../../types/note';

interface NoteItemProps {
    note: Note;
    isActive: boolean;
    folders: Folder[];
    onSelect: (id: string) => void;
    onDelete: (id: string) => void;
    onMoveToFolder: (noteId: string, folderId: string | null) => void;
}

export const NoteItem = React.memo(function NoteItem({
    note,
    isActive,
    folders,
    onSelect,
    onDelete,
    onMoveToFolder,
}: NoteItemProps) {
    const [showMoveMenu, setShowMoveMenu] = useState(false);
    const moveMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!showMoveMenu) return;
        const handler = (e: MouseEvent) => {
            if (moveMenuRef.current && !moveMenuRef.current.contains(e.target as Node)) {
                setShowMoveMenu(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [showMoveMenu]);

    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return '刚刚';
        if (minutes < 60) return `${minutes} 分钟前`;
        if (hours < 24) return `${hours} 小时前`;
        if (days < 7) return `${days} 天前`;
        return date.toLocaleDateString('zh-CN');
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm(`确定要删除「${note.title}」吗？`)) {
            onDelete(note.id);
        }
    };

    const handleMoveClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowMoveMenu(!showMoveMenu);
    };

    const handleMoveToFolder = (folderId: string | null) => {
        onMoveToFolder(note.id, folderId);
        setShowMoveMenu(false);
    };

    const summary = note.content
        .replace(/[#*`~\[\]>!|-]/g, '')
        .trim()
        .slice(0, 60);

    const currentFolder = folders.find((f) => f.id === note.folderId);

    return (
        <div
            id={`note-item-${note.id}`}
            onClick={() => onSelect(note.id)}
            className="group px-4 py-3 cursor-pointer transition-all duration-200"
            style={{
                borderBottom: '1px solid var(--border-color)',
                borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                backgroundColor: isActive ? 'var(--active-bg)' : 'transparent',
            }}
            onMouseEnter={(e) => {
                if (!isActive) {
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--hover-bg)';
                }
            }}
            onMouseLeave={(e) => {
                if (!isActive) {
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                }
            }}
        >
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                    <h3
                        className="text-sm font-medium truncate"
                        style={{ color: isActive ? 'var(--accent-hover)' : 'var(--text-primary)' }}
                    >
                        {note.title || '未命名笔记'}
                    </h3>
                    {summary && (
                        <p className="text-xs mt-1 truncate" style={{ color: 'var(--text-muted)' }}>{summary}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs" style={{ color: 'var(--text-placeholder)' }}>
                            {formatTime(note.updatedAt)}
                        </span>
                        {currentFolder && (
                            <span
                                className="text-xs px-1.5 py-0.5 rounded-full"
                                style={{
                                    backgroundColor: 'var(--accent-bg)',
                                    color: 'var(--accent-muted)',
                                    fontSize: '10px',
                                }}
                            >
                                {currentFolder.name}
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-0.5 relative">
                    {/* 移动到文件夹 */}
                    {folders.length > 0 && (
                        <button
                            onClick={handleMoveClick}
                            className="opacity-0 group-hover:opacity-100 p-1 rounded transition-all duration-200"
                            style={{ color: 'var(--text-muted)' }}
                            title="移动到文件夹"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                            </svg>
                        </button>
                    )}
                    {/* 删除 */}
                    <button
                        id={`delete-note-${note.id}`}
                        onClick={handleDelete}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                        title="删除笔记"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                        </svg>
                    </button>

                    {/* 移动文件夹弹出菜单 */}
                    {showMoveMenu && (
                        <div
                            ref={moveMenuRef}
                            className="absolute right-0 top-full mt-1 w-40 py-1 rounded-lg shadow-2xl z-50"
                            style={{
                                backgroundColor: 'var(--bg-secondary)',
                                border: '1px solid var(--border-color)',
                            }}
                        >
                            <div className="px-3 py-1.5 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                                移动到
                            </div>
                            <button
                                onClick={() => handleMoveToFolder(null)}
                                className="w-full text-left px-3 py-1.5 text-xs transition-colors flex items-center gap-1.5"
                                style={{
                                    color: !note.folderId ? 'var(--accent)' : 'var(--text-secondary)',
                                }}
                                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--hover-bg)'; }}
                                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
                            >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                未分类
                                {!note.folderId && <span className="ml-auto">✓</span>}
                            </button>
                            {folders.map((f) => (
                                <button
                                    key={f.id}
                                    onClick={() => handleMoveToFolder(f.id)}
                                    className="w-full text-left px-3 py-1.5 text-xs transition-colors flex items-center gap-1.5"
                                    style={{
                                        color: note.folderId === f.id ? 'var(--accent)' : 'var(--text-secondary)',
                                    }}
                                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--hover-bg)'; }}
                                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                    </svg>
                                    <span className="truncate">{f.name}</span>
                                    {note.folderId === f.id && <span className="ml-auto">✓</span>}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});
