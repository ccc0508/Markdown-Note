import React, { useMemo, useState, useCallback } from 'react';

interface TocItem {
    level: number;
    text: string;
    id: string;
}

interface TableOfContentsProps {
    content: string;
}

/** 从 Markdown 原始内容解析出标题列表 */
function extractHeadings(content: string): TocItem[] {
    const headings: TocItem[] = [];
    const lines = content.split('\n');
    let inCodeBlock = false;

    for (const rawLine of lines) {
        const line = rawLine.trimEnd();
        if (line.trimStart().startsWith('```')) {
            inCodeBlock = !inCodeBlock;
            continue;
        }
        if (inCodeBlock) continue;

        const match = line.match(/^(#{1,6})\s+(.+)$/);
        if (match) {
            const level = match[1].length;
            const text = match[2].replace(/[*_`~\[\]]/g, '').trim();
            const id = text
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^\w\u4e00-\u9fff-]/g, '');
            headings.push({ level, text, id });
        }
    }
    return headings;
}

export const TableOfContents = React.memo(function TableOfContents({
    content,
}: TableOfContentsProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const headings = useMemo(() => extractHeadings(content), [content]);

    const handleClick = useCallback((id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, []);

    if (headings.length === 0) {
        return null;
    }

    const minLevel = Math.min(...headings.map((h) => h.level));

    return (
        <div
            className="w-56 min-w-[200px] flex flex-col h-full"
            style={{
                backgroundColor: 'var(--bg-toc-sidebar)',
                borderLeft: '1px solid var(--border-color)',
            }}
        >
            {/* 标题栏 */}
            <div
                className="px-4 py-3 flex items-center justify-between"
                style={{ borderBottom: '1px solid var(--border-color)' }}
            >
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    <span className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>目录</span>
                </div>
                <button
                    id="toggle-toc-btn"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-1 rounded transition-colors"
                    style={{ color: 'var(--text-placeholder)' }}
                    onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--hover-bg)';
                    }}
                    onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.color = 'var(--text-placeholder)';
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                    }}
                    title={isCollapsed ? '展开目录' : '收起目录'}
                >
                    <svg
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>

            {/* 目录列表 */}
            {!isCollapsed && (
                <nav className="flex-1 overflow-y-auto custom-scrollbar py-2">
                    {headings.map((heading, index) => {
                        const indent = (heading.level - minLevel) * 12;
                        return (
                            <button
                                key={`${heading.id}-${index}`}
                                onClick={() => handleClick(heading.id)}
                                className="w-full text-left px-4 py-1.5 text-xs transition-colors duration-150 group"
                                style={{ paddingLeft: `${16 + indent}px` }}
                                title={heading.text}
                                onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--hover-bg)';
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                                }}
                            >
                                <span
                                    className="block truncate transition-colors duration-150"
                                    style={{
                                        color: heading.level <= 2 ? 'var(--text-secondary)' : 'var(--text-muted)',
                                        fontWeight: heading.level <= 2 ? 500 : 400,
                                    }}
                                >
                                    {heading.text}
                                </span>
                            </button>
                        );
                    })}
                </nav>
            )}
        </div>
    );
});
