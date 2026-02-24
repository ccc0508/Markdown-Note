import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
    language: string;
    children: string;
}

export function CodeBlock({ language, children }: CodeBlockProps) {
    return (
        <div className="relative group my-4 rounded-xl overflow-hidden">
            {/* 语言标签 */}
            <div
                className="flex items-center justify-between px-4 py-2"
                style={{
                    backgroundColor: 'var(--bg-tertiary)',
                    borderBottom: '1px solid var(--border-color)',
                }}
            >
                <span className="text-xs font-mono uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                    {language}
                </span>
                <button
                    onClick={() => navigator.clipboard.writeText(children)}
                    className="text-xs transition-colors opacity-0 group-hover:opacity-100"
                    style={{ color: 'var(--text-muted)' }}
                >
                    复制
                </button>
            </div>
            <SyntaxHighlighter
                style={oneDark}
                language={language}
                PreTag="div"
                showLineNumbers
                customStyle={{
                    margin: 0,
                    borderRadius: 0,
                    background: 'var(--bg-secondary)',
                    fontSize: '13px',
                    lineHeight: '1.7',
                }}
                lineNumberStyle={{
                    color: 'var(--text-placeholder)',
                    minWidth: '2.5em',
                }}
            >
                {children}
            </SyntaxHighlighter>
        </div>
    );
}
