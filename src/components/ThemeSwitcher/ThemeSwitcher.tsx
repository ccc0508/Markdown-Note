import React, { useState, useRef, useEffect } from 'react';
import type { Theme } from '../../themes';

interface ThemeSwitcherProps {
    currentTheme: Theme;
    themes: Theme[];
    onThemeChange: (id: string) => void;
}

export const ThemeSwitcher = React.memo(function ThemeSwitcher({
    currentTheme,
    themes,
    onThemeChange,
}: ThemeSwitcherProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // 点击外部关闭下拉
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                id="theme-switcher-btn"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-all duration-200"
                style={{
                    color: 'var(--text-secondary)',
                    backgroundColor: isOpen ? 'var(--hover-bg)' : 'transparent',
                }}
                onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--hover-bg)';
                    (e.currentTarget as HTMLElement).style.color = 'var(--accent)';
                }}
                onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = isOpen ? 'var(--hover-bg)' : 'transparent';
                    (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                }}
                title="切换主题"
            >
                <span className="text-sm">{currentTheme.icon}</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div
                    className="absolute right-0 top-full mt-2 w-48 py-1.5 rounded-xl shadow-2xl z-50 overflow-hidden"
                    style={{
                        backgroundColor: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                    }}
                >
                    <div
                        className="px-3 py-2 text-xs font-medium uppercase tracking-wider"
                        style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}
                    >
                        选择主题
                    </div>
                    {themes.map((theme) => {
                        const isActive = theme.id === currentTheme.id;
                        return (
                            <button
                                key={theme.id}
                                onClick={() => {
                                    onThemeChange(theme.id);
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm transition-all duration-150"
                                style={{
                                    color: isActive ? 'var(--accent)' : 'var(--text-primary)',
                                    backgroundColor: isActive ? 'var(--accent-bg)' : 'transparent',
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive) {
                                        (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--hover-bg)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLElement).style.backgroundColor = isActive ? 'var(--accent-bg)' : 'transparent';
                                }}
                            >
                                <span className="text-base">{theme.icon}</span>
                                <span className="flex-1">{theme.name}</span>
                                {/* 颜色预览圆点 */}
                                <div className="flex items-center gap-1">
                                    <span
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: theme.colors.accent }}
                                    />
                                    <span
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: theme.colors.bgPrimary, border: '1px solid ' + theme.colors.borderColor }}
                                    />
                                </div>
                                {isActive && (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--accent)' }}>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
});
