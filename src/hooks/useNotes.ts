import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Note } from '../types/note';
import { storage } from '../utils/storage';

export function useNotes() {
    const [notes, setNotes] = useState<Note[]>(() => storage.getNotes());
    const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // 笔记变更时自动持久化
    useEffect(() => {
        storage.saveNotes(notes);
    }, [notes]);

    // 当前激活的笔记
    const activeNote = useMemo(
        () => notes.find((n) => n.id === activeNoteId) ?? null,
        [notes, activeNoteId]
    );

    // 按搜索词过滤并按更新时间倒序排列
    const filteredNotes = useMemo(() => {
        let result = [...notes];
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (note) =>
                    note.title.toLowerCase().includes(query) ||
                    note.content.toLowerCase().includes(query)
            );
        }
        return result.sort((a, b) => b.updatedAt - a.updatedAt);
    }, [notes, searchQuery]);

    // 创建笔记
    const createNote = useCallback(() => {
        const newNote: Note = {
            id: crypto.randomUUID(),
            title: '未命名笔记',
            content: '',
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };
        setNotes((prev) => [newNote, ...prev]);
        setActiveNoteId(newNote.id);
        return newNote;
    }, []);

    // 更新笔记
    const updateNote = useCallback(
        (id: string, updates: Partial<Pick<Note, 'title' | 'content'>>) => {
            setNotes((prev) =>
                prev.map((note) =>
                    note.id === id
                        ? { ...note, ...updates, updatedAt: Date.now() }
                        : note
                )
            );
        },
        []
    );

    // 删除笔记
    const deleteNote = useCallback(
        (id: string) => {
            setNotes((prev) => {
                const remaining = prev.filter((note) => note.id !== id);
                // 如果删除的是当前选中笔记，切换到第一条
                if (id === activeNoteId) {
                    setActiveNoteId(remaining.length > 0 ? remaining[0].id : null);
                }
                return remaining;
            });
        },
        [activeNoteId]
    );

    // 触发文件下载
    const downloadFile = useCallback((filename: string, content: string, mime: string) => {
        const blob = new Blob([content], { type: mime });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }, []);

    // 导出当前笔记为 .md 文件
    const exportCurrentNote = useCallback(() => {
        if (!activeNoteId) return;
        const note = notes.find((n) => n.id === activeNoteId);
        if (!note) return;
        const filename = `${note.title || '未命名笔记'}.md`;
        const content = note.title ? `# ${note.title}\n\n${note.content}` : note.content;
        downloadFile(filename, content, 'text/markdown;charset=utf-8');
    }, [notes, activeNoteId, downloadFile]);

    // 导出全部笔记为 JSON 备份
    const exportAllNotes = useCallback(() => {
        const data = JSON.stringify({ notes, exportedAt: new Date().toISOString() }, null, 2);
        const filename = `markdown-notes-backup-${new Date().toISOString().slice(0, 10)}.json`;
        downloadFile(filename, data, 'application/json;charset=utf-8');
    }, [notes, downloadFile]);

    // 导入笔记（支持 .md 和 .json）
    const importNotes = useCallback(() => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.md,.json';
        input.multiple = true;
        input.onchange = async () => {
            if (!input.files) return;
            const newNotes: Note[] = [];

            for (const file of Array.from(input.files)) {
                const text = await file.text();

                if (file.name.endsWith('.json')) {
                    // JSON 备份文件：批量导入
                    try {
                        const data = JSON.parse(text);
                        const importedNotes: Note[] = Array.isArray(data) ? data : data.notes;
                        if (Array.isArray(importedNotes)) {
                            for (const n of importedNotes) {
                                newNotes.push({
                                    id: crypto.randomUUID(),
                                    title: n.title || '导入笔记',
                                    content: n.content || '',
                                    createdAt: n.createdAt || Date.now(),
                                    updatedAt: Date.now(),
                                });
                            }
                        }
                    } catch {
                        alert(`文件 "${file.name}" 不是有效的 JSON 格式`);
                    }
                } else {
                    // .md 文件：解析标题和内容
                    let title = file.name.replace(/\.md$/i, '');
                    let content = text;

                    // 如果内容以 # 标题开头，提取为标题
                    const titleMatch = text.match(/^#\s+(.+)\n/);
                    if (titleMatch) {
                        title = titleMatch[1].trim();
                        content = text.slice(titleMatch[0].length).trimStart();
                    }

                    newNotes.push({
                        id: crypto.randomUUID(),
                        title,
                        content,
                        createdAt: Date.now(),
                        updatedAt: Date.now(),
                    });
                }
            }

            if (newNotes.length > 0) {
                setNotes((prev) => [...newNotes, ...prev]);
                setActiveNoteId(newNotes[0].id);
            }
        };
        input.click();
    }, []);

    return {
        notes: filteredNotes,
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
        importNotes,
    };
}
