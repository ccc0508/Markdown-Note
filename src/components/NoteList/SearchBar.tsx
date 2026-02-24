import React from 'react';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
}

export const SearchBar = React.memo(function SearchBar({
    value,
    onChange,
}: SearchBarProps) {
    return (
        <div className="p-3 border-b border-white/10">
            <div className="relative">
                <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
                <input
                    id="search-input"
                    type="text"
                    placeholder="搜索笔记..."
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-colors"
                />
            </div>
        </div>
    );
});
