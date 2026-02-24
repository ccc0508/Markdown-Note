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

    // 导出当前笔记为 PDF（通过浏览器打印功能，支持任意长度的多页内容）
    const exportPdf = useCallback(() => {
        if (!activeNoteId) return;
        const note = notes.find((n) => n.id === activeNoteId);
        if (!note) return;

        // 查找预览面板的渲染内容
        const previewEl = document.querySelector('.markdown-preview');
        if (!previewEl) {
            alert('请先打开预览面板');
            return;
        }

        // 创建隐藏的 iframe 用于打印（不影响主页面）
        const iframe = document.createElement('iframe');
        iframe.style.cssText = 'position:fixed;left:-9999px;top:-9999px;width:0;height:0;';
        document.body.appendChild(iframe);

        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!iframeDoc) {
            document.body.removeChild(iframe);
            return;
        }

        // 打印友好的 CSS 样式
        const printCSS = `
            @page {
                size: A4;
                margin: 20mm 15mm;
            }
            * { box-sizing: border-box; }
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
                color: #1a1a2e;
                line-height: 1.8;
                font-size: 14px;
                padding: 0;
                margin: 0;
                background: white;
            }
            h1 { font-size: 28px; font-weight: 700; margin: 0 0 16px; padding-bottom: 12px; border-bottom: 2px solid #e5e7eb; }
            h2 { font-size: 22px; font-weight: 600; margin: 24px 0 12px; padding-bottom: 8px; border-bottom: 1px solid #e5e7eb; }
            h3 { font-size: 18px; font-weight: 600; margin: 20px 0 8px; }
            h4, h5, h6 { font-size: 16px; font-weight: 600; margin: 16px 0 8px; }
            p { margin: 8px 0; }
            a { color: #4f46e5; text-decoration: underline; }
            img { max-width: 100%; height: auto; border-radius: 8px; margin: 8px 0; }

            /* 代码块 */
            pre {
                background: #f5f5f5;
                border: 1px solid #e0e0e0;
                border-radius: 6px;
                padding: 12px 16px;
                overflow-x: auto;
                font-size: 13px;
                line-height: 1.5;
                page-break-inside: avoid;
            }
            code {
                font-family: 'Cascadia Code', 'Fira Code', Consolas, monospace;
                background: #f0f0f0;
                padding: 2px 6px;
                border-radius: 4px;
                font-size: 0.9em;
                color: #333;
            }
            pre code {
                background: none;
                padding: 0;
                border-radius: 0;
            }

            /* 表格 */
            table { border-collapse: collapse; width: 100%; margin: 12px 0; page-break-inside: avoid; }
            th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; }
            th { background: #f0f0f0; font-weight: 600; }

            /* 引用块 */
            blockquote {
                border-left: 4px solid #6366f1;
                background: #f8f8ff;
                margin: 12px 0;
                padding: 12px 16px;
                color: #555;
                page-break-inside: avoid;
            }

            /* 列表 */
            ul, ol { padding-left: 24px; margin: 8px 0; }
            li { margin: 4px 0; }
            li::marker { color: #6366f1; }

            /* 任务列表 */
            input[type="checkbox"] { margin-right: 8px; }

            /* 高亮 */
            mark { background: #d1fae5; color: #065f46; padding: 2px 4px; border-radius: 3px; }

            /* 水平线 */
            hr { border: none; height: 1px; background: #e5e7eb; margin: 24px 0; }

            /* 避免标题和内容分页断开 */
            h1, h2, h3, h4, h5, h6 { page-break-after: avoid; }
            blockquote, pre, table, img { page-break-inside: avoid; }
        `;

        // 写入 iframe 文档
        iframeDoc.open();
        iframeDoc.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>${note.title || '未命名笔记'}</title>
                <style>${printCSS}</style>
            </head>
            <body>${previewEl.innerHTML}</body>
            </html>
        `);
        iframeDoc.close();

        // 等待图片等资源加载完成后打印
        iframe.onload = () => {
            setTimeout(() => {
                iframe.contentWindow?.print();
                // 打印完成后移除 iframe
                setTimeout(() => {
                    document.body.removeChild(iframe);
                }, 1000);
            }, 300);
        };

        // 备用：如果 onload 不触发（已完成加载），手动触发
        setTimeout(() => {
            if (document.body.contains(iframe)) {
                iframe.contentWindow?.print();
                setTimeout(() => {
                    if (document.body.contains(iframe)) {
                        document.body.removeChild(iframe);
                    }
                }, 1000);
            }
        }, 2000);
    }, [notes, activeNoteId]);

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
        exportPdf,
        importNotes,
    };
}
