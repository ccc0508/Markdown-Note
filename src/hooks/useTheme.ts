import { useState, useEffect, useCallback } from 'react';
import { themes, defaultThemeId, type Theme } from '../themes';

const STORAGE_KEY = 'mindflow-theme-id';

function applyThemeToDOM(theme: Theme) {
    const root = document.documentElement;
    const c = theme.colors;

    root.style.setProperty('--bg-primary', c.bgPrimary);
    root.style.setProperty('--bg-secondary', c.bgSecondary);
    root.style.setProperty('--bg-tertiary', c.bgTertiary);
    root.style.setProperty('--bg-sidebar', c.bgSidebar);
    root.style.setProperty('--bg-toc-sidebar', c.bgTocSidebar);
    root.style.setProperty('--border-color', c.borderColor);

    root.style.setProperty('--text-primary', c.textPrimary);
    root.style.setProperty('--text-secondary', c.textSecondary);
    root.style.setProperty('--text-muted', c.textMuted);
    root.style.setProperty('--text-placeholder', c.textPlaceholder);
    root.style.setProperty('--text-heading', c.textHeading);

    root.style.setProperty('--accent', c.accent);
    root.style.setProperty('--accent-hover', c.accentHover);
    root.style.setProperty('--accent-muted', c.accentMuted);
    root.style.setProperty('--accent-bg', c.accentBg);

    root.style.setProperty('--editor-bg', c.editorBg);
    root.style.setProperty('--editor-text', c.editorText);

    root.style.setProperty('--preview-text', c.previewText);
    root.style.setProperty('--preview-heading', c.previewHeading);
    root.style.setProperty('--preview-code-bg', c.previewCodeBg);
    root.style.setProperty('--preview-code-border', c.previewCodeBorder);
    root.style.setProperty('--preview-blockquote-bg', c.previewBlockquoteBg);
    root.style.setProperty('--preview-blockquote-border', c.previewBlockquoteBorder);
    root.style.setProperty('--preview-table-border', c.previewTableBorder);
    root.style.setProperty('--preview-table-header-bg', c.previewTableHeaderBg);
    root.style.setProperty('--preview-link-color', c.previewLinkColor);

    root.style.setProperty('--scrollbar-thumb', c.scrollbarThumb);
    root.style.setProperty('--scrollbar-thumb-hover', c.scrollbarThumbHover);

    root.style.setProperty('--hover-bg', c.hoverBg);
    root.style.setProperty('--active-bg', c.activeBg);
}

export function useTheme() {
    const [themeId, setThemeId] = useState<string>(() => {
        try {
            return localStorage.getItem(STORAGE_KEY) || defaultThemeId;
        } catch {
            return defaultThemeId;
        }
    });

    const currentTheme = themes.find((t) => t.id === themeId) || themes[0];

    // Apply theme on mount and change
    useEffect(() => {
        applyThemeToDOM(currentTheme);
    }, [currentTheme]);

    const setTheme = useCallback((id: string) => {
        setThemeId(id);
        try {
            localStorage.setItem(STORAGE_KEY, id);
        } catch {
            // localStorage unavailable
        }
    }, []);

    return {
        currentTheme,
        themes,
        setTheme,
    };
}
