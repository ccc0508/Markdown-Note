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
            <div className="flex items-center justify-between px-4 py-2 bg-[#1e1e2e] border-b border-white/5">
                <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">
                    {language}
                </span>
                <button
                    onClick={() => navigator.clipboard.writeText(children)}
                    className="text-xs text-slate-500 hover:text-slate-300 transition-colors opacity-0 group-hover:opacity-100"
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
                    background: '#1a1b26',
                    fontSize: '13px',
                    lineHeight: '1.7',
                }}
                lineNumberStyle={{
                    color: '#3b3f54',
                    minWidth: '2.5em',
                }}
            >
                {children}
            </SyntaxHighlighter>
        </div>
    );
}
