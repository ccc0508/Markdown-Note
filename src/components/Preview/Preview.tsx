import React, { useMemo, useRef, useCallback, type ReactNode } from 'react';
import ReactMarkdown, { defaultUrlTransform } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import type { Components } from 'react-markdown';
import { CodeBlock } from './CodeBlock';
import { imageStorage } from '../../utils/storage';

// 从 children 中提取纯文本并生成 ID
function getHeadingId(children: ReactNode): string {
    const text = extractText(children);
    return text
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\u4e00-\u9fff-]/g, '');
}

function extractText(node: ReactNode): string {
    if (typeof node === 'string') return node;
    if (typeof node === 'number') return String(node);
    if (Array.isArray(node)) return node.map(extractText).join('');
    if (node && typeof node === 'object' && 'props' in node) {
        const el = node as React.ReactElement<{ children?: ReactNode }>;
        return extractText(el.props.children);
    }
    return '';
}

// 允许 data: URL 通过（解析后的 Base64 图片），其余走默认安全检查
function urlTransform(url: string): string {
    if (url.startsWith('data:')) return url;
    return defaultUrlTransform(url);
}

interface PreviewProps {
    content: string;
    title: string;
    onContentChange?: (content: string) => void;
}

export const Preview = React.memo(function Preview({ content, title, onContentChange }: PreviewProps) {
    // 建立 checkbox 渲染索引 → 源内容行号的映射
    const checkboxLineMap = useMemo(() => {
        const map: number[] = [];
        const lines = content.split('\n');
        let inCodeBlock = false;
        lines.forEach((line, lineIndex) => {
            const trimmed = line.trimStart();
            if (trimmed.startsWith('```')) {
                inCodeBlock = !inCodeBlock;
                return;
            }
            if (inCodeBlock) return;
            if (/^[-*+]\s*\[([ xX])\]/.test(trimmed)) {
                map.push(lineIndex);
            }
        });
        return map;
    }, [content]);

    const checkboxIndexRef = useRef(0);
    checkboxIndexRef.current = 0;

    // 切换指定行号的任务列表复选框
    const toggleCheckbox = useCallback((renderIndex: number) => {
        if (!onContentChange) return;
        const lineIndex = checkboxLineMap[renderIndex];
        if (lineIndex === undefined) return;

        const lines = content.split('\n');
        const line = lines[lineIndex];
        if (/\[ \]/.test(line)) {
            lines[lineIndex] = line.replace('[ ]', '[x]');
        } else if (/\[[xX]\]/.test(line)) {
            lines[lineIndex] = line.replace(/\[[xX]\]/, '[ ]');
        }
        onContentChange(lines.join('\n'));
    }, [content, onContentChange, checkboxLineMap]);
    const components: Components = {
        code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const codeString = String(children).replace(/\n$/, '');

            // 多行代码块（有语言声明）
            if (match) {
                return <CodeBlock language={match[1]}>{codeString}</CodeBlock>;
            }

            // 多行代码块（无语言声明，通过是否包含换行判断）
            if (codeString.includes('\n')) {
                return <CodeBlock language="text">{codeString}</CodeBlock>;
            }

            // 行内代码
            return (
                <code
                    className="px-1.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 text-[0.85em] font-mono"
                    {...props}
                >
                    {children}
                </code>
            );
        },
        // 自定义链接：新窗口打开
        a({ children, href, ...props }) {
            return (
                <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 decoration-indigo-400/30 hover:decoration-indigo-300/50 transition-colors"
                    {...props}
                >
                    {children}
                </a>
            );
        },
        // 自定义表格
        table({ children, ...props }) {
            return (
                <div className="my-4 overflow-x-auto rounded-lg border border-white/10">
                    <table className="w-full" {...props}>
                        {children}
                    </table>
                </div>
            );
        },
        th({ children, ...props }) {
            return (
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-300 bg-white/5 border-b border-white/10" {...props}>
                    {children}
                </th>
            );
        },
        td({ children, ...props }) {
            return (
                <td className="px-4 py-2.5 text-sm text-slate-400 border-b border-white/5" {...props}>
                    {children}
                </td>
            );
        },
        // 自定义引用块
        blockquote({ children, ...props }) {
            return (
                <blockquote
                    className="my-4 pl-4 border-l-4 border-indigo-500/40 bg-indigo-500/5 py-3 pr-4 rounded-r-lg text-slate-400 italic"
                    {...props}
                >
                    {children}
                </blockquote>
            );
        },
        // 自定义分割线
        hr({ ...props }) {
            return (
                <hr className="my-8 border-none h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" {...props} />
            );
        },
        // 自定义图片渲染
        img({ src, alt, ...props }) {
            return (
                <img
                    src={src}
                    alt={alt || ''}
                    className="max-w-full rounded-xl my-4 border border-white/5"
                    loading="lazy"
                    {...props}
                />
            );
        },
        // 自定义标题渲染：添加 ID 供目录导航跳转
        h1({ children, ...props }) {
            return <h1 id={getHeadingId(children)} {...props}>{children}</h1>;
        },
        h2({ children, ...props }) {
            return <h2 id={getHeadingId(children)} {...props}>{children}</h2>;
        },
        h3({ children, ...props }) {
            return <h3 id={getHeadingId(children)} {...props}>{children}</h3>;
        },
        h4({ children, ...props }) {
            return <h4 id={getHeadingId(children)} {...props}>{children}</h4>;
        },
        h5({ children, ...props }) {
            return <h5 id={getHeadingId(children)} {...props}>{children}</h5>;
        },
        h6({ children, ...props }) {
            return <h6 id={getHeadingId(children)} {...props}>{children}</h6>;
        },
        // 自定义高亮渲染：==文字== 语法，绿色显示
        mark({ children, ...props }) {
            return (
                <mark
                    className="bg-emerald-500/15 text-emerald-400 px-1 rounded-sm"
                    {...props}
                >
                    {children}
                </mark>
            );
        },
        // 自定义复选框：可点击切换
        input(props) {
            if (props.type === 'checkbox') {
                const currentIndex = checkboxIndexRef.current++;
                return (
                    <input
                        type="checkbox"
                        checked={props.checked}
                        onChange={() => toggleCheckbox(currentIndex)}
                    />
                );
            }
            return <input {...props} />;
        },
    };

    // 渲染前处理自定义语法
    const resolvedContent = useMemo(() => {
        let result = imageStorage.resolveContent(content);
        // ==高亮文字== → <mark>高亮文字</mark>
        result = result.replace(/==([^=]+)==/g, '<mark>$1</mark>');
        return result;
    }, [content]);

    if (!content && !title) {
        return (
            <div className="flex-1 flex items-center justify-center bg-[#0d0f16]">
                <p className="text-slate-600 text-sm">预览区域</p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto bg-[#0d0f16] custom-scrollbar">
            <article className="max-w-none px-8 py-6 markdown-preview">
                {title && (
                    <h1 className="text-3xl font-bold text-slate-100 mb-6 pb-4 border-b border-white/10 tracking-tight">
                        {title}
                    </h1>
                )}
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={components} urlTransform={urlTransform}>
                    {resolvedContent}
                </ReactMarkdown>
            </article>
        </div>
    );
});
