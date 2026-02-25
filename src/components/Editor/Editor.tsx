import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Note } from '../../types/note';
import { useDebounce } from '../../hooks/useDebounce';
import { imageStorage } from '../../utils/storage';

interface EditorProps {
    note: Note | null;
    onUpdateNote: (id: string, updates: Partial<Pick<Note, 'title' | 'content'>>) => void;
}

// ===== 工具栏按钮定义 =====

interface ToolbarAction {
    id: string;
    icon: string; // SVG path
    label: string;
    shortcut?: string;
    type: 'wrap' | 'prefix' | 'insert' | 'custom';
    // wrap: 用 before/after 包裹选中文本
    before?: string;
    after?: string;
    // prefix: 在行首添加前缀
    prefix?: string;
    // insert: 插入固定文本
    insertText?: string;
    placeholder?: string;
}

const TOOLBAR_ACTIONS: (ToolbarAction | 'separator')[] = [
    {
        id: 'heading',
        icon: 'M4 6h16M4 12h8m-8 6h16',
        label: '标题',
        type: 'prefix',
        prefix: '## ',
    },
    {
        id: 'bold',
        icon: 'M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z',
        label: '加粗',
        shortcut: 'Ctrl+B',
        type: 'wrap',
        before: '**',
        after: '**',
        placeholder: '粗体文字',
    },
    {
        id: 'italic',
        icon: 'M10 4h4m-6 16h4m1-16l-4 16',
        label: '斜体',
        shortcut: 'Ctrl+I',
        type: 'wrap',
        before: '*',
        after: '*',
        placeholder: '斜体文字',
    },
    {
        id: 'strikethrough',
        icon: 'M16 4H9a3 3 0 000 6h6a3 3 0 010 6H8 M4 12h16',
        label: '删除线',
        shortcut: 'Ctrl+D',
        type: 'wrap',
        before: '~~',
        after: '~~',
        placeholder: '删除线文字',
    },
    {
        id: 'highlight',
        icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z',
        label: '高亮',
        type: 'wrap',
        before: '==',
        after: '==',
        placeholder: '高亮文字',
    },
    'separator',
    {
        id: 'inline-code',
        icon: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
        label: '行内代码',
        shortcut: 'Ctrl+E',
        type: 'wrap',
        before: '`',
        after: '`',
        placeholder: 'code',
    },
    {
        id: 'code-block',
        icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
        label: '代码块',
        type: 'insert',
        insertText: '```\n\n```',
    },
    'separator',
    {
        id: 'link',
        icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1',
        label: '链接',
        shortcut: 'Ctrl+K',
        type: 'custom',
    },
    {
        id: 'image',
        icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
        label: '插入图片',
        type: 'custom',
    },
    'separator',
    {
        id: 'ul',
        icon: 'M4 6h16M4 10h16M4 14h16M4 18h16',
        label: '无序列表',
        type: 'prefix',
        prefix: '- ',
    },
    {
        id: 'ol',
        icon: 'M6 6h14M6 12h14M6 18h14M3 6h.01M3 12h.01M3 18h.01',
        label: '有序列表',
        type: 'prefix',
        prefix: '1. ',
    },
    {
        id: 'task',
        icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
        label: '任务列表',
        type: 'prefix',
        prefix: '- [ ] ',
    },
    'separator',
    {
        id: 'quote',
        icon: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z',
        label: '引用',
        type: 'prefix',
        prefix: '> ',
    },
    {
        id: 'hr',
        icon: 'M5 12h14',
        label: '分隔线',
        type: 'insert',
        insertText: '\n---\n',
    },
    {
        id: 'table',
        icon: 'M3 10h18M3 14h18M10 3v18M14 3v18',
        label: '表格',
        type: 'insert',
        insertText: '| 列1 | 列2 | 列3 |\n| --- | --- | --- |\n| 内容 | 内容 | 内容 |',
    },
];

// 快捷键映射
const SHORTCUT_MAP: Record<string, string> = {
    'b': 'bold',
    'i': 'italic',
    'd': 'strikethrough',
    'e': 'inline-code',
    'k': 'link',
};

export const Editor = React.memo(function Editor({
    note,
    onUpdateNote,
}: EditorProps) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isDragOver, setIsDragOver] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const titleInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const lastLocalContentRef = useRef('');

    useEffect(() => {
        if (note) {
            setTitle(note.title);
            setContent(note.content);
            lastLocalContentRef.current = note.content;
        } else {
            setTitle('');
            setContent('');
            lastLocalContentRef.current = '';
        }
    }, [note?.id]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (note && note.content !== lastLocalContentRef.current) {
            setContent(note.content);
            lastLocalContentRef.current = note.content;
        }
    }, [note?.content]); // eslint-disable-line react-hooks/exhaustive-deps

    const debouncedTitle = useDebounce(title, 400);
    const debouncedContent = useDebounce(content, 400);

    useEffect(() => {
        if (note && (debouncedTitle !== note.title || debouncedContent !== note.content)) {
            onUpdateNote(note.id, { title: debouncedTitle, content: debouncedContent });
            lastLocalContentRef.current = debouncedContent;
        }
    }, [debouncedTitle, debouncedContent]); // eslint-disable-line react-hooks/exhaustive-deps

    // ===== 文本操作辅助函数 =====

    const applyTextTransform = useCallback((
        transformFn: (text: string, start: number, end: number) => { newText: string; cursorStart: number; cursorEnd: number }
    ) => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const result = transformFn(content, start, end);
        setContent(result.newText);
        lastLocalContentRef.current = result.newText;
        requestAnimationFrame(() => {
            textarea.selectionStart = result.cursorStart;
            textarea.selectionEnd = result.cursorEnd;
            textarea.focus();
        });
    }, [content]);

    // 包裹选中文字
    const wrapSelection = useCallback((before: string, after: string, placeholder: string) => {
        applyTextTransform((text, start, end) => {
            const selected = text.slice(start, end);
            const hasWrap = selected.startsWith(before) && selected.endsWith(after) && selected.length >= before.length + after.length;
            if (hasWrap) {
                // 取消包裹（toggle）
                const unwrapped = selected.slice(before.length, selected.length - after.length);
                return {
                    newText: text.slice(0, start) + unwrapped + text.slice(end),
                    cursorStart: start,
                    cursorEnd: start + unwrapped.length,
                };
            }
            // 如果外围已有标记也 toggle
            const outerStart = start - before.length;
            const outerEnd = end + after.length;
            if (outerStart >= 0 && outerEnd <= text.length
                && text.slice(outerStart, start) === before
                && text.slice(end, outerEnd) === after) {
                return {
                    newText: text.slice(0, outerStart) + selected + text.slice(outerEnd),
                    cursorStart: outerStart,
                    cursorEnd: outerStart + selected.length,
                };
            }
            const toWrap = selected || placeholder;
            const newText = text.slice(0, start) + before + toWrap + after + text.slice(end);
            return {
                newText,
                cursorStart: start + before.length,
                cursorEnd: start + before.length + toWrap.length,
            };
        });
    }, [applyTextTransform]);

    // 行首添加前缀
    const addLinePrefix = useCallback((prefix: string) => {
        applyTextTransform((text, start, end) => {
            // 找到当前行首
            const lineStart = text.lastIndexOf('\n', start - 1) + 1;
            const lineEnd = text.indexOf('\n', end);
            const actualEnd = lineEnd === -1 ? text.length : lineEnd;
            const lines = text.slice(lineStart, actualEnd).split('\n');

            // 如果所有行都已有该前缀，则移除（toggle）
            const allHavePrefix = lines.every(l => l.startsWith(prefix));
            const newLines = allHavePrefix
                ? lines.map(l => l.slice(prefix.length))
                : lines.map(l => prefix + l);

            const joined = newLines.join('\n');
            const newText = text.slice(0, lineStart) + joined + text.slice(actualEnd);
            const diff = joined.length - (actualEnd - lineStart);
            return {
                newText,
                cursorStart: allHavePrefix ? Math.max(lineStart, start - prefix.length) : start + prefix.length,
                cursorEnd: end + diff,
            };
        });
    }, [applyTextTransform]);

    // 插入文本
    const insertText = useCallback((textToInsert: string) => {
        applyTextTransform((text, start, end) => {
            // 如果需要换行
            const needNewline = start > 0 && text[start - 1] !== '\n';
            const prefix = needNewline ? '\n' : '';
            const newText = text.slice(0, start) + prefix + textToInsert + text.slice(end);
            const cursorPos = start + prefix.length + textToInsert.length;
            return { newText, cursorStart: cursorPos, cursorEnd: cursorPos };
        });
    }, [applyTextTransform]);

    // 链接
    const insertLink = useCallback(() => {
        applyTextTransform((text, start, end) => {
            const selected = text.slice(start, end);
            // 如果选中的是 URL，放到 href 里
            const isUrl = /^https?:\/\//.test(selected);
            const linkText = isUrl ? '链接文字' : (selected || '链接文字');
            const url = isUrl ? selected : 'https://';
            const markdown = `[${linkText}](${url})`;
            const newText = text.slice(0, start) + markdown + text.slice(end);
            // 选中 URL 部分以便编辑
            const urlStart = start + linkText.length + 3; // [linkText](
            return {
                newText,
                cursorStart: isUrl ? start + 1 : urlStart,
                cursorEnd: isUrl ? start + 1 + linkText.length : urlStart + url.length,
            };
        });
    }, [applyTextTransform]);

    // ===== 处理工具栏动作 =====

    const handleToolbarAction = useCallback((action: ToolbarAction) => {
        if (action.id === 'image') {
            fileInputRef.current?.click();
            return;
        }
        if (action.id === 'link') {
            insertLink();
            return;
        }
        switch (action.type) {
            case 'wrap':
                wrapSelection(action.before!, action.after!, action.placeholder || '');
                break;
            case 'prefix':
                addLinePrefix(action.prefix!);
                break;
            case 'insert':
                insertText(action.insertText!);
                break;
        }
    }, [wrapSelection, addLinePrefix, insertText, insertLink]);

    // ===== 图片相关 =====

    const insertImageAtCursor = useCallback((file: File) => {
        if (!file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result as string;
            const imageId = imageStorage.save(base64);
            const altText = file.name.replace(/\.[^.]+$/, '');
            const markdownImage = `![${altText}](img:${imageId})`;
            const textarea = textareaRef.current;
            if (textarea) {
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const before = content.slice(0, start);
                const after = content.slice(end);
                const pfx = before.length > 0 && !before.endsWith('\n') ? '\n' : '';
                const sfx = after.length > 0 && !after.startsWith('\n') ? '\n' : '';
                const newContent = before + pfx + markdownImage + sfx + after;
                setContent(newContent);
                lastLocalContentRef.current = newContent;
                requestAnimationFrame(() => {
                    const newPos = start + pfx.length + markdownImage.length + sfx.length;
                    textarea.selectionStart = textarea.selectionEnd = newPos;
                    textarea.focus();
                });
            } else {
                setContent((prev) => prev + (prev.length > 0 ? '\n' : '') + markdownImage + '\n');
            }
        };
        reader.readAsDataURL(file);
    }, [content]);

    const handleImageFiles = useCallback((files: FileList | File[]) => {
        const imageFiles = Array.from(files).filter((f) => f.type.startsWith('image/'));
        imageFiles.forEach((file) => insertImageAtCursor(file));
    }, [insertImageAtCursor]);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleImageFiles(e.target.files);
            e.target.value = '';
        }
    }, [handleImageFiles]);

    const handlePaste = useCallback((e: React.ClipboardEvent<HTMLTextAreaElement>) => {
        const items = e.clipboardData?.items;
        if (!items) return;
        for (const item of Array.from(items)) {
            if (item.type.startsWith('image/')) {
                e.preventDefault();
                const file = item.getAsFile();
                if (file) insertImageAtCursor(file);
                return;
            }
        }
    }, [insertImageAtCursor]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        if (e.dataTransfer.files.length > 0) {
            handleImageFiles(e.dataTransfer.files);
        }
    }, [handleImageFiles]);

    // ===== 键盘快捷键 =====

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // Tab 缩进
        if (e.key === 'Tab') {
            e.preventDefault();
            const textarea = textareaRef.current;
            if (!textarea) return;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const newContent = content.slice(0, start) + '  ' + content.slice(end);
            setContent(newContent);
            lastLocalContentRef.current = newContent;
            requestAnimationFrame(() => {
                textarea.selectionStart = textarea.selectionEnd = start + 2;
            });
            return;
        }

        // Ctrl/Cmd 快捷键
        if (e.ctrlKey || e.metaKey) {
            const key = e.key.toLowerCase();
            const actionId = SHORTCUT_MAP[key];
            if (actionId) {
                e.preventDefault();
                const action = TOOLBAR_ACTIONS.find(
                    (a): a is ToolbarAction => a !== 'separator' && a.id === actionId
                );
                if (action) handleToolbarAction(action);
            }
        }
    }, [content, handleToolbarAction]);

    // ===== 渲染 =====

    if (!note) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center" style={{ backgroundColor: 'var(--editor-bg)' }}>
                <div className="w-24 h-24 rounded-2xl flex items-center justify-center mb-6" style={{ background: 'linear-gradient(135deg, var(--accent-bg), var(--active-bg))' }}>
                    <svg className="w-12 h-12" style={{ color: 'var(--accent-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </div>
                <p className="text-lg font-medium" style={{ color: 'var(--text-muted)' }}>选择或创建一篇笔记</p>
                <p className="text-sm mt-2" style={{ color: 'var(--text-placeholder)' }}>开始你的 Markdown 写作之旅 ✨</p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col min-w-0" style={{ backgroundColor: 'var(--editor-bg)' }}>
            {/* 标题输入 */}
            <div className="px-6 pt-5 pb-3" style={{ borderBottom: '1px solid var(--border-color)' }}>
                <input
                    id="note-title-input"
                    ref={titleInputRef}
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="笔记标题..."
                    className="w-full bg-transparent text-2xl font-bold focus:outline-none tracking-tight"
                    style={{ color: 'var(--text-primary)' }}
                />
            </div>

            {/* Markdown 快捷工具栏 */}
            <div
                className="px-4 py-1.5 flex items-center gap-0.5 overflow-x-auto custom-scrollbar"
                style={{ borderBottom: '1px solid var(--border-color)' }}
            >
                {TOOLBAR_ACTIONS.map((item, i) => {
                    if (item === 'separator') {
                        return (
                            <div
                                key={`sep-${i}`}
                                className="w-px h-4 mx-1 flex-shrink-0"
                                style={{ backgroundColor: 'var(--border-color)' }}
                            />
                        );
                    }
                    return (
                        <button
                            key={item.id}
                            id={`toolbar-${item.id}`}
                            onClick={() => handleToolbarAction(item)}
                            className="p-1.5 rounded-md transition-all duration-150 flex-shrink-0"
                            style={{ color: 'var(--text-muted)' }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLElement).style.color = 'var(--accent)';
                                (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--accent-bg)';
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
                                (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                            }}
                            title={item.shortcut ? `${item.label} (${item.shortcut})` : item.label}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                            </svg>
                        </button>
                    );
                })}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    aria-label="上传图片文件"
                />
            </div>

            {/* 内容编辑器 */}
            <div
                className={`flex-1 relative transition-colors duration-200 ${isDragOver ? 'ring-2 ring-inset rounded-lg m-1' : ''}`}
                style={isDragOver ? { backgroundColor: 'var(--accent-bg)', borderColor: 'var(--accent)' } : {}}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {isDragOver && (
                    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                        <div className="flex flex-col items-center gap-2 px-8 py-6 rounded-2xl" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--accent-muted)' }}>
                            <svg className="w-10 h-10" style={{ color: 'var(--accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-sm font-medium" style={{ color: 'var(--accent)' }}>释放以插入图片</p>
                        </div>
                    </div>
                )}
                <textarea
                    id="note-content-editor"
                    ref={textareaRef}
                    value={content}
                    onChange={(e) => {
                        setContent(e.target.value);
                        lastLocalContentRef.current = e.target.value;
                    }}
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                    placeholder={"开始编写 Markdown 内容...\n\n支持标题、列表、代码块、表格等语法\n可直接粘贴或拖放图片到此处"}
                    className="absolute inset-0 w-full h-full px-6 py-4 bg-transparent resize-none focus:outline-none font-mono text-sm leading-7 custom-scrollbar"
                    style={{ color: 'var(--editor-text)' }}
                    spellCheck={false}
                />
            </div>
        </div>
    );
});
