import React, { useMemo, useCallback, type ReactNode } from 'react';
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
    // 切换指定源码行号的任务列表复选框
    const toggleCheckboxAtLine = useCallback((lineIndex: number) => {
        if (!onContentChange) return;
        const lines = content.split('\n');
        if (lineIndex < 0 || lineIndex >= lines.length) return;
        const line = lines[lineIndex];
        if (/\[ \]/.test(line)) {
            lines[lineIndex] = line.replace('[ ]', '[x]');
        } else if (/\[[xX]\]/.test(line)) {
            lines[lineIndex] = line.replace(/\[[xX]\]/, '[ ]');
        }
        onContentChange(lines.join('\n'));
    }, [content, onContentChange]);

    const components: Components = {
        code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const codeString = String(children).replace(/\n$/, '');

            if (match) {
                return <CodeBlock language={match[1]}>{codeString}</CodeBlock>;
            }

            if (codeString.includes('\n')) {
                return <CodeBlock language="text">{codeString}</CodeBlock>;
            }

            // 行内代码
            return (
                <code
                    className="px-1.5 py-0.5 rounded-md text-[0.85em] font-mono"
                    style={{
                        backgroundColor: 'var(--preview-code-bg)',
                        color: 'var(--accent-hover)',
                    }}
                    {...props}
                >
                    {children}
                </code>
            );
        },
        pre({ children }) {
            return <div>{children}</div>;
        },
        table({ children, ...props }) {
            return (
                <div className="overflow-x-auto my-4 rounded-xl" style={{ border: '1px solid var(--preview-table-border)' }}>
                    <table className="w-full text-sm" {...props}>{children}</table>
                </div>
            );
        },
        thead({ children, ...props }) {
            return (
                <thead style={{ backgroundColor: 'var(--preview-table-header-bg)', color: 'var(--text-primary)' }} {...props}>
                    {children}
                </thead>
            );
        },
        th({ children, ...props }) {
            return (
                <th className="px-4 py-2.5 text-left font-semibold tracking-wide" style={{ borderBottom: '1px solid var(--preview-table-border)' }} {...props}>
                    {children}
                </th>
            );
        },
        td({ children, ...props }) {
            return (
                <td className="px-4 py-2.5" style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }} {...props}>
                    {children}
                </td>
            );
        },
        blockquote({ children, ...props }) {
            return (
                <blockquote
                    className="pl-4 my-4 italic py-3 pr-4 rounded-r-lg"
                    style={{
                        borderLeft: '4px solid var(--preview-blockquote-border)',
                        backgroundColor: 'var(--preview-blockquote-bg)',
                        color: 'var(--text-secondary)',
                    }}
                    {...props}
                >
                    {children}
                </blockquote>
            );
        },
        hr({ ...props }) {
            return (
                <hr
                    className="my-8 border-none h-px"
                    style={{ background: `linear-gradient(to right, transparent, var(--accent-muted), transparent)` }}
                    {...props}
                />
            );
        },
        a({ children, href, ...props }) {
            return (
                <a
                    href={href}
                    className="underline transition-colors"
                    style={{ color: 'var(--preview-link-color)' }}
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                >
                    {children}
                </a>
            );
        },
        img({ src, alt, ...props }) {
            return (
                <img
                    src={src}
                    alt={alt || ''}
                    className="max-w-full rounded-xl my-4"
                    style={{ border: '1px solid var(--border-color)' }}
                    loading="lazy"
                    {...props}
                />
            );
        },
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
        mark({ children, ...props }) {
            return (
                <mark
                    className="px-1 rounded-sm"
                    style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}
                    {...props}
                >
                    {children}
                </mark>
            );
        },
        li({ node, children, className, ...props }: any) {
            if (className === 'task-list-item' && node?.position) {
                const sourceLine = node.position.start.line - 1;
                return (
                    <li className={className} data-source-line={sourceLine} {...props}>
                        {children}
                    </li>
                );
            }
            return <li className={className} {...props}>{children}</li>;
        },
        input(props: any) {
            if (props.type === 'checkbox') {
                return (
                    <input
                        type="checkbox"
                        checked={!!props.checked}
                        onChange={(e) => {
                            const li = (e.target as HTMLElement).closest('li[data-source-line]');
                            if (li) {
                                const lineIndex = parseInt(li.getAttribute('data-source-line')!, 10);
                                toggleCheckboxAtLine(lineIndex);
                            }
                        }}
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
            <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
                <p className="text-sm" style={{ color: 'var(--text-placeholder)' }}>预览区域</p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto custom-scrollbar" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <article className="max-w-none px-8 py-6 markdown-preview">
                {title && (
                    <h1
                        className="text-3xl font-bold mb-6 pb-4 tracking-tight"
                        style={{ color: 'var(--preview-heading)', borderBottom: '1px solid var(--border-color)' }}
                    >
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
