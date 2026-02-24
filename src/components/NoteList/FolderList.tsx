import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { Folder } from '../../types/note';

interface FolderListProps {
    folders: Folder[];
    activeFolderId: string | null;
    allNotesCount: number;
    folderNoteCounts: Record<string, number>;
    onSelectFolder: (id: string | null) => void;
    onCreateFolder: (name: string) => void;
    onRenameFolder: (id: string, name: string) => void;
    onDeleteFolder: (id: string) => void;
}

export const FolderList = React.memo(function FolderList({
    folders,
    activeFolderId,
    allNotesCount,
    folderNoteCounts,
    onSelectFolder,
    onCreateFolder,
    onRenameFolder,
    onDeleteFolder,
}: FolderListProps) {
    const [isCreating, setIsCreating] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState('');
    const [isCollapsed, setIsCollapsed] = useState(false);
    const createInputRef = useRef<HTMLInputElement>(null);
    const editInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isCreating && createInputRef.current) {
            createInputRef.current.focus();
        }
    }, [isCreating]);

    useEffect(() => {
        if (editingId && editInputRef.current) {
            editInputRef.current.focus();
            editInputRef.current.select();
        }
    }, [editingId]);

    const handleCreateSubmit = useCallback(() => {
        const name = newFolderName.trim();
        if (name) {
            onCreateFolder(name);
        }
        setNewFolderName('');
        setIsCreating(false);
    }, [newFolderName, onCreateFolder]);

    const handleRenameSubmit = useCallback(() => {
        if (editingId) {
            const name = editingName.trim();
            if (name) {
                onRenameFolder(editingId, name);
            }
        }
        setEditingId(null);
        setEditingName('');
    }, [editingId, editingName, onRenameFolder]);

    const startRename = useCallback((folder: Folder, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingId(folder.id);
        setEditingName(folder.name);
    }, []);

    const handleDelete = useCallback((id: string, name: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm(`确定要删除文件夹「${name}」吗？\n其中的笔记将移到"全部笔记"。`)) {
            onDeleteFolder(id);
        }
    }, [onDeleteFolder]);

    const uncategorizedCount = allNotesCount - Object.values(folderNoteCounts).reduce((a, b) => a + b, 0);

    return (
        <div style={{ borderBottom: '1px solid var(--border-color)' }}>
            {/* 标题栏 */}
            <div
                className="px-4 py-2.5 flex items-center justify-between cursor-pointer select-none"
                onClick={() => setIsCollapsed(!isCollapsed)}
                style={{ color: 'var(--text-muted)' }}
            >
                <div className="flex items-center gap-1.5">
                    <svg
                        className={`w-3 h-3 transition-transform duration-200 ${isCollapsed ? '-rotate-90' : ''}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    <span className="text-xs font-medium uppercase tracking-wider">文件夹</span>
                </div>
                <button
                    id="create-folder-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsCollapsed(false);
                        setIsCreating(true);
                    }}
                    className="p-0.5 rounded transition-colors"
                    style={{ color: 'var(--text-placeholder)' }}
                    onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.color = 'var(--accent)';
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--accent-bg)';
                    }}
                    onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.color = 'var(--text-placeholder)';
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                    }}
                    title="新建文件夹"
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </button>
            </div>

            {/* 文件夹列表 */}
            {!isCollapsed && (
                <div className="pb-1">
                    {/* 全部笔记 */}
                    <button
                        id="folder-all"
                        onClick={() => onSelectFolder(null)}
                        className="w-full text-left px-4 py-1.5 text-xs flex items-center justify-between gap-2 transition-colors duration-150"
                        style={{
                            backgroundColor: activeFolderId === null ? 'var(--active-bg)' : 'transparent',
                            color: activeFolderId === null ? 'var(--accent-hover)' : 'var(--text-secondary)',
                            borderLeft: activeFolderId === null ? '2px solid var(--accent)' : '2px solid transparent',
                        }}
                        onMouseEnter={(e) => {
                            if (activeFolderId !== null) {
                                (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--hover-bg)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (activeFolderId !== null) {
                                (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                            }
                        }}
                    >
                        <span className="flex items-center gap-1.5 truncate">
                            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            全部笔记
                        </span>
                        <span style={{ color: 'var(--text-placeholder)' }}>{allNotesCount}</span>
                    </button>

                    {/* 各文件夹 */}
                    {folders.map((folder) => (
                        <div key={folder.id}>
                            {editingId === folder.id ? (
                                <div className="px-4 py-1">
                                    <input
                                        ref={editInputRef}
                                        type="text"
                                        value={editingName}
                                        onChange={(e) => setEditingName(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleRenameSubmit();
                                            if (e.key === 'Escape') { setEditingId(null); setEditingName(''); }
                                        }}
                                        onBlur={handleRenameSubmit}
                                        className="w-full px-2 py-1 rounded text-xs focus:outline-none"
                                        style={{
                                            backgroundColor: 'var(--hover-bg)',
                                            border: '1px solid var(--accent)',
                                            color: 'var(--text-primary)',
                                        }}
                                        aria-label="重命名文件夹"
                                    />
                                </div>
                            ) : (
                                <button
                                    id={`folder-${folder.id}`}
                                    onClick={() => onSelectFolder(folder.id)}
                                    className="group w-full text-left px-4 py-1.5 text-xs flex items-center justify-between gap-2 transition-colors duration-150"
                                    style={{
                                        backgroundColor: activeFolderId === folder.id ? 'var(--active-bg)' : 'transparent',
                                        color: activeFolderId === folder.id ? 'var(--accent-hover)' : 'var(--text-secondary)',
                                        borderLeft: activeFolderId === folder.id ? '2px solid var(--accent)' : '2px solid transparent',
                                    }}
                                    onMouseEnter={(e) => {
                                        if (activeFolderId !== folder.id) {
                                            (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--hover-bg)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (activeFolderId !== folder.id) {
                                            (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                                        }
                                    }}
                                >
                                    <span className="flex items-center gap-1.5 truncate">
                                        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                        </svg>
                                        <span className="truncate">{folder.name}</span>
                                    </span>
                                    <span className="flex items-center gap-1">
                                        {/* 编辑 / 删除按钮 */}
                                        <span
                                            onClick={(e) => startRename(folder, e)}
                                            className="opacity-0 group-hover:opacity-100 p-0.5 rounded transition-opacity"
                                            style={{ color: 'var(--text-muted)' }}
                                            title="重命名"
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </span>
                                        <span
                                            onClick={(e) => handleDelete(folder.id, folder.name, e)}
                                            className="opacity-0 group-hover:opacity-100 p-0.5 rounded transition-opacity hover:text-red-400"
                                            style={{ color: 'var(--text-muted)' }}
                                            title="删除"
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </span>
                                        <span style={{ color: 'var(--text-placeholder)' }}>{folderNoteCounts[folder.id] || 0}</span>
                                    </span>
                                </button>
                            )}
                        </div>
                    ))}

                    {/* 未分类 — 当有文件夹时才显示 */}
                    {folders.length > 0 && (
                        <button
                            id="folder-uncategorized"
                            onClick={() => onSelectFolder('__uncategorized__')}
                            className="w-full text-left px-4 py-1.5 text-xs flex items-center justify-between gap-2 transition-colors duration-150"
                            style={{
                                backgroundColor: activeFolderId === '__uncategorized__' ? 'var(--active-bg)' : 'transparent',
                                color: activeFolderId === '__uncategorized__' ? 'var(--accent-hover)' : 'var(--text-muted)',
                                borderLeft: activeFolderId === '__uncategorized__' ? '2px solid var(--accent)' : '2px solid transparent',
                            }}
                            onMouseEnter={(e) => {
                                if (activeFolderId !== '__uncategorized__') {
                                    (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--hover-bg)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (activeFolderId !== '__uncategorized__') {
                                    (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                                }
                            }}
                        >
                            <span className="flex items-center gap-1.5 truncate">
                                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                未分类
                            </span>
                            <span style={{ color: 'var(--text-placeholder)' }}>{uncategorizedCount}</span>
                        </button>
                    )}

                    {/* 新建文件夹输入 */}
                    {isCreating && (
                        <div className="px-4 py-1">
                            <input
                                ref={createInputRef}
                                type="text"
                                value={newFolderName}
                                onChange={(e) => setNewFolderName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleCreateSubmit();
                                    if (e.key === 'Escape') { setIsCreating(false); setNewFolderName(''); }
                                }}
                                onBlur={handleCreateSubmit}
                                placeholder="文件夹名称..."
                                className="w-full px-2 py-1 rounded text-xs focus:outline-none"
                                style={{
                                    backgroundColor: 'var(--hover-bg)',
                                    border: '1px solid var(--accent)',
                                    color: 'var(--text-primary)',
                                }}
                                aria-label="新建文件夹名称"
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
});
