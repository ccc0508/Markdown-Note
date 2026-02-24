import React from 'react';
import type { Note } from '../../types/note';

interface NoteItemProps {
    note: Note;
    isActive: boolean;
    onSelect: (id: string) => void;
    onDelete: (id: string) => void;
}

export const NoteItem = React.memo(function NoteItem({
    note,
    isActive,
    onSelect,
    onDelete,
}: NoteItemProps) {
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

    // 获取内容摘要（前 60 个字符）
    const summary = note.content
        .replace(/[#*`~\[\]>!|-]/g, '')
        .trim()
        .slice(0, 60);

    return (
        <div
            id={`note-item-${note.id}`}
            onClick={() => onSelect(note.id)}
            className={`group px-4 py-3 cursor-pointer border-b border-white/5 transition-all duration-200 ${isActive
                    ? 'bg-indigo-500/15 border-l-2 border-l-indigo-400'
                    : 'hover:bg-white/5 border-l-2 border-l-transparent'
                }`}
        >
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                    <h3
                        className={`text-sm font-medium truncate ${isActive ? 'text-indigo-300' : 'text-slate-200'
                            }`}
                    >
                        {note.title || '未命名笔记'}
                    </h3>
                    {summary && (
                        <p className="text-xs text-slate-500 mt-1 truncate">{summary}</p>
                    )}
                    <p className="text-xs text-slate-600 mt-1">
                        {formatTime(note.updatedAt)}
                    </p>
                </div>
                <button
                    id={`delete-note-${note.id}`}
                    onClick={handleDelete}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                    title="删除笔记"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
});
