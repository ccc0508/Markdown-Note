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
        const line = rawLine.trimEnd(); // 处理 \r\n 换行符
        // 跳过代码块内的 # 号
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

    // 计算最小层级用于缩进归一化
    const minLevel = Math.min(...headings.map((h) => h.level));

    return (
        <div className="w-56 min-w-[200px] bg-[#0a0c12] border-l border-white/10 flex flex-col h-full">
            {/* 标题栏 */}
            <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">目录</span>
                </div>
                <button
                    id="toggle-toc-btn"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-1 rounded text-slate-600 hover:text-slate-400 hover:bg-white/5 transition-colors"
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
                                className="w-full text-left px-4 py-1.5 text-xs hover:bg-white/5 transition-colors duration-150 group"
                                style={{ paddingLeft: `${16 + indent}px` }}
                                title={heading.text}
                            >
                                <span
                                    className={`block truncate transition-colors duration-150 ${heading.level <= 2
                                        ? 'text-slate-400 group-hover:text-indigo-400 font-medium'
                                        : 'text-slate-600 group-hover:text-slate-400'
                                        }`}
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
