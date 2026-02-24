import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Note } from '../../types/note';
import { useDebounce } from '../../hooks/useDebounce';
import { imageStorage } from '../../utils/storage';

interface EditorProps {
    note: Note | null;
    onUpdateNote: (id: string, updates: Partial<Pick<Note, 'title' | 'content'>>) => void;
}

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
    // 跟踪用户本地编辑的内容，用于区分外部更新
    const lastLocalContentRef = useRef('');

    // 当选中笔记变化时同步本地状态
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

    // 检测外部内容更新（例如预览面板的复选框切换）
    useEffect(() => {
        if (note && note.content !== lastLocalContentRef.current) {
            setContent(note.content);
            lastLocalContentRef.current = note.content;
        }
    }, [note?.content]); // eslint-disable-line react-hooks/exhaustive-deps

    // 防抖保存
    const debouncedTitle = useDebounce(title, 400);
    const debouncedContent = useDebounce(content, 400);

    useEffect(() => {
        if (note && (debouncedTitle !== note.title || debouncedContent !== note.content)) {
            onUpdateNote(note.id, { title: debouncedTitle, content: debouncedContent });
            lastLocalContentRef.current = debouncedContent;
        }
    }, [debouncedTitle, debouncedContent]); // eslint-disable-line react-hooks/exhaustive-deps

    // 将图片文件存为短 ID 引用并插入到光标位置
    const insertImageAtCursor = useCallback((file: File) => {
        if (!file.type.startsWith('image/')) return;

        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result as string;
            // 图片存到独立存储，返回短 ID
            const imageId = imageStorage.save(base64);
            const altText = file.name.replace(/\.[^.]+$/, '');
            const markdownImage = `![${altText}](img:${imageId})`;

            const textarea = textareaRef.current;
            if (textarea) {
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const before = content.slice(0, start);
                const after = content.slice(end);
                const prefix = before.length > 0 && !before.endsWith('\n') ? '\n' : '';
                const suffix = after.length > 0 && !after.startsWith('\n') ? '\n' : '';
                const newContent = before + prefix + markdownImage + suffix + after;
                setContent(newContent);
                requestAnimationFrame(() => {
                    const newPos = start + prefix.length + markdownImage.length + suffix.length;
                    textarea.selectionStart = textarea.selectionEnd = newPos;
                    textarea.focus();
                });
            } else {
                setContent((prev) => prev + (prev.length > 0 ? '\n' : '') + markdownImage + '\n');
            }
        };
        reader.readAsDataURL(file);
    }, [content]);

    // 处理多个图片文件
    const handleImageFiles = useCallback((files: FileList | File[]) => {
        const imageFiles = Array.from(files).filter((f) => f.type.startsWith('image/'));
        imageFiles.forEach((file) => insertImageAtCursor(file));
    }, [insertImageAtCursor]);

    // 按钮点击上传
    const handleUploadClick = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleImageFiles(e.target.files);
            e.target.value = ''; // 允许再次选择同一文件
        }
    }, [handleImageFiles]);

    // 粘贴支持：Ctrl+V 粘贴剪贴板中的图片
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

    // 拖放支持
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

    // Tab 缩进支持
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const textarea = textareaRef.current;
            if (!textarea) return;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const newContent = content.slice(0, start) + '  ' + content.slice(end);
            setContent(newContent);
            requestAnimationFrame(() => {
                textarea.selectionStart = textarea.selectionEnd = start + 2;
            });
        }
    };

    if (!note) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-[#12141c]">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center mb-6">
                    <svg className="w-12 h-12 text-indigo-400/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </div>
                <p className="text-slate-500 text-lg font-medium">选择或创建一篇笔记</p>
                <p className="text-slate-600 text-sm mt-2">开始你的 Markdown 写作之旅 ✨</p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-[#12141c] min-w-0">
            {/* 标题输入 */}
            <div className="px-6 pt-5 pb-3 border-b border-white/5">
                <input
                    id="note-title-input"
                    ref={titleInputRef}
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="笔记标题..."
                    className="w-full bg-transparent text-2xl font-bold text-slate-100 placeholder-slate-600 focus:outline-none tracking-tight"
                />
            </div>

            {/* 工具栏 */}
            <div className="px-6 py-2 border-b border-white/5 flex items-center gap-1">
                <button
                    id="upload-image-btn"
                    onClick={handleUploadClick}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all duration-200"
                    title="上传图片（也可粘贴或拖放图片）"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    插入图片
                </button>
                <span className="text-xs text-slate-700 ml-2">支持粘贴 / 拖放图片</span>
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
                className={`flex-1 relative transition-colors duration-200 ${isDragOver ? 'bg-indigo-500/5 ring-2 ring-inset ring-indigo-500/30 rounded-lg m-1' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {isDragOver && (
                    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                        <div className="flex flex-col items-center gap-2 bg-[#12141c]/90 px-8 py-6 rounded-2xl border border-indigo-500/30">
                            <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-indigo-300 text-sm font-medium">释放以插入图片</p>
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
                    placeholder="开始编写 Markdown 内容...&#10;&#10;支持标题、列表、代码块、表格等语法&#10;可直接粘贴或拖放图片到此处"
                    className="absolute inset-0 w-full h-full px-6 py-4 bg-transparent text-slate-300 placeholder-slate-700 resize-none focus:outline-none font-mono text-sm leading-7 custom-scrollbar"
                    spellCheck={false}
                />
            </div>
        </div>
    );
});

