export interface ThemeColors {
    // 基础
    bgPrimary: string;
    bgSecondary: string;
    bgTertiary: string;
    bgSidebar: string;
    bgTocSidebar: string;
    borderColor: string;

    // 文本
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    textPlaceholder: string;
    textHeading: string;

    // 强调色
    accent: string;
    accentHover: string;
    accentMuted: string;
    accentBg: string;

    // 编辑器
    editorBg: string;
    editorText: string;

    // 预览
    previewText: string;
    previewHeading: string;
    previewCodeBg: string;
    previewCodeBorder: string;
    previewBlockquoteBg: string;
    previewBlockquoteBorder: string;
    previewTableBorder: string;
    previewTableHeaderBg: string;
    previewLinkColor: string;

    // 滚动条
    scrollbarThumb: string;
    scrollbarThumbHover: string;

    // 按钮/交互
    hoverBg: string;
    activeBg: string;
}

export interface Theme {
    id: string;
    name: string;
    icon: string;
    colors: ThemeColors;
}

export const themes: Theme[] = [
    {
        id: 'midnight',
        name: '午夜深蓝',
        icon: '🌑',
        colors: {
            bgPrimary: '#0d0f16',
            bgSecondary: '#12141c',
            bgTertiary: '#181b25',
            bgSidebar: '#0f1117',
            bgTocSidebar: '#0a0c12',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            textPrimary: '#e2e8f0',
            textSecondary: '#94a3b8',
            textMuted: '#64748b',
            textPlaceholder: '#334155',
            textHeading: '#e6edf3',
            accent: '#6366f1',
            accentHover: '#818cf8',
            accentMuted: 'rgba(99, 102, 241, 0.5)',
            accentBg: 'rgba(99, 102, 241, 0.1)',
            editorBg: '#12141c',
            editorText: '#cbd5e1',
            previewText: '#c9d1d9',
            previewHeading: '#e6edf3',
            previewCodeBg: 'rgba(99, 102, 241, 0.08)',
            previewCodeBorder: 'rgba(99, 102, 241, 0.15)',
            previewBlockquoteBg: 'rgba(99, 102, 241, 0.05)',
            previewBlockquoteBorder: 'rgba(99, 102, 241, 0.4)',
            previewTableBorder: 'rgba(255, 255, 255, 0.1)',
            previewTableHeaderBg: 'rgba(255, 255, 255, 0.03)',
            previewLinkColor: '#818cf8',
            scrollbarThumb: 'rgba(255, 255, 255, 0.08)',
            scrollbarThumbHover: 'rgba(255, 255, 255, 0.15)',
            hoverBg: 'rgba(255, 255, 255, 0.05)',
            activeBg: 'rgba(99, 102, 241, 0.1)',
        },
    },
    {
        id: 'github-dark',
        name: 'GitHub 暗色',
        icon: '🐙',
        colors: {
            bgPrimary: '#0d1117',
            bgSecondary: '#161b22',
            bgTertiary: '#1c2129',
            bgSidebar: '#0d1117',
            bgTocSidebar: '#0a0e14',
            borderColor: '#30363d',
            textPrimary: '#c9d1d9',
            textSecondary: '#8b949e',
            textMuted: '#6e7681',
            textPlaceholder: '#3b434b',
            textHeading: '#f0f6fc',
            accent: '#58a6ff',
            accentHover: '#79c0ff',
            accentMuted: 'rgba(88, 166, 255, 0.4)',
            accentBg: 'rgba(88, 166, 255, 0.1)',
            editorBg: '#161b22',
            editorText: '#c9d1d9',
            previewText: '#c9d1d9',
            previewHeading: '#f0f6fc',
            previewCodeBg: 'rgba(110, 118, 129, 0.1)',
            previewCodeBorder: 'rgba(110, 118, 129, 0.2)',
            previewBlockquoteBg: 'rgba(88, 166, 255, 0.05)',
            previewBlockquoteBorder: '#3b434b',
            previewTableBorder: '#30363d',
            previewTableHeaderBg: 'rgba(110, 118, 129, 0.08)',
            previewLinkColor: '#58a6ff',
            scrollbarThumb: 'rgba(110, 118, 129, 0.3)',
            scrollbarThumbHover: 'rgba(110, 118, 129, 0.5)',
            hoverBg: 'rgba(110, 118, 129, 0.1)',
            activeBg: 'rgba(88, 166, 255, 0.1)',
        },
    },
    {
        id: 'emerald',
        name: '翡翠绿',
        icon: '🌲',
        colors: {
            bgPrimary: '#0a1410',
            bgSecondary: '#0f1a14',
            bgTertiary: '#152018',
            bgSidebar: '#0c1610',
            bgTocSidebar: '#081210',
            borderColor: 'rgba(52, 211, 153, 0.12)',
            textPrimary: '#d1fae5',
            textSecondary: '#6ee7b7',
            textMuted: '#34d399',
            textPlaceholder: '#1a4a35',
            textHeading: '#ecfdf5',
            accent: '#10b981',
            accentHover: '#34d399',
            accentMuted: 'rgba(16, 185, 129, 0.4)',
            accentBg: 'rgba(16, 185, 129, 0.1)',
            editorBg: '#0f1a14',
            editorText: '#a7f3d0',
            previewText: '#a7f3d0',
            previewHeading: '#ecfdf5',
            previewCodeBg: 'rgba(16, 185, 129, 0.08)',
            previewCodeBorder: 'rgba(16, 185, 129, 0.15)',
            previewBlockquoteBg: 'rgba(16, 185, 129, 0.05)',
            previewBlockquoteBorder: 'rgba(16, 185, 129, 0.4)',
            previewTableBorder: 'rgba(52, 211, 153, 0.15)',
            previewTableHeaderBg: 'rgba(52, 211, 153, 0.05)',
            previewLinkColor: '#34d399',
            scrollbarThumb: 'rgba(52, 211, 153, 0.12)',
            scrollbarThumbHover: 'rgba(52, 211, 153, 0.25)',
            hoverBg: 'rgba(52, 211, 153, 0.08)',
            activeBg: 'rgba(16, 185, 129, 0.1)',
        },
    },
    {
        id: 'rose',
        name: '玫瑰粉',
        icon: '🌸',
        colors: {
            bgPrimary: '#160a10',
            bgSecondary: '#1c0f15',
            bgTertiary: '#23141b',
            bgSidebar: '#140c10',
            bgTocSidebar: '#120810',
            borderColor: 'rgba(251, 113, 133, 0.12)',
            textPrimary: '#ffe4e6',
            textSecondary: '#fda4af',
            textMuted: '#fb7185',
            textPlaceholder: '#4a1a28',
            textHeading: '#fff1f2',
            accent: '#f43f5e',
            accentHover: '#fb7185',
            accentMuted: 'rgba(244, 63, 94, 0.4)',
            accentBg: 'rgba(244, 63, 94, 0.1)',
            editorBg: '#1c0f15',
            editorText: '#fecdd3',
            previewText: '#fecdd3',
            previewHeading: '#fff1f2',
            previewCodeBg: 'rgba(244, 63, 94, 0.08)',
            previewCodeBorder: 'rgba(244, 63, 94, 0.15)',
            previewBlockquoteBg: 'rgba(244, 63, 94, 0.05)',
            previewBlockquoteBorder: 'rgba(244, 63, 94, 0.4)',
            previewTableBorder: 'rgba(251, 113, 133, 0.15)',
            previewTableHeaderBg: 'rgba(251, 113, 133, 0.05)',
            previewLinkColor: '#fb7185',
            scrollbarThumb: 'rgba(251, 113, 133, 0.12)',
            scrollbarThumbHover: 'rgba(251, 113, 133, 0.25)',
            hoverBg: 'rgba(251, 113, 133, 0.08)',
            activeBg: 'rgba(244, 63, 94, 0.1)',
        },
    },
    {
        id: 'light',
        name: '经典亮色',
        icon: '☀️',
        colors: {
            bgPrimary: '#ffffff',
            bgSecondary: '#f8fafc',
            bgTertiary: '#f1f5f9',
            bgSidebar: '#f8fafc',
            bgTocSidebar: '#f1f5f9',
            borderColor: '#e2e8f0',
            textPrimary: '#1e293b',
            textSecondary: '#475569',
            textMuted: '#94a3b8',
            textPlaceholder: '#cbd5e1',
            textHeading: '#0f172a',
            accent: '#6366f1',
            accentHover: '#4f46e5',
            accentMuted: 'rgba(99, 102, 241, 0.5)',
            accentBg: 'rgba(99, 102, 241, 0.08)',
            editorBg: '#ffffff',
            editorText: '#334155',
            previewText: '#374151',
            previewHeading: '#111827',
            previewCodeBg: '#f3f4f6',
            previewCodeBorder: '#e5e7eb',
            previewBlockquoteBg: '#f8fafc',
            previewBlockquoteBorder: '#6366f1',
            previewTableBorder: '#e5e7eb',
            previewTableHeaderBg: '#f9fafb',
            previewLinkColor: '#4f46e5',
            scrollbarThumb: 'rgba(0, 0, 0, 0.12)',
            scrollbarThumbHover: 'rgba(0, 0, 0, 0.2)',
            hoverBg: 'rgba(0, 0, 0, 0.04)',
            activeBg: 'rgba(99, 102, 241, 0.08)',
        },
    },
    {
        id: 'sunset',
        name: '落日橙',
        icon: '🌅',
        colors: {
            bgPrimary: '#18120e',
            bgSecondary: '#1f1812',
            bgTertiary: '#261e16',
            bgSidebar: '#16100c',
            bgTocSidebar: '#140e0a',
            borderColor: 'rgba(251, 146, 60, 0.12)',
            textPrimary: '#fed7aa',
            textSecondary: '#fdba74',
            textMuted: '#fb923c',
            textPlaceholder: '#4a2e14',
            textHeading: '#fff7ed',
            accent: '#f97316',
            accentHover: '#fb923c',
            accentMuted: 'rgba(249, 115, 22, 0.4)',
            accentBg: 'rgba(249, 115, 22, 0.1)',
            editorBg: '#1f1812',
            editorText: '#fed7aa',
            previewText: '#fed7aa',
            previewHeading: '#fff7ed',
            previewCodeBg: 'rgba(249, 115, 22, 0.08)',
            previewCodeBorder: 'rgba(249, 115, 22, 0.15)',
            previewBlockquoteBg: 'rgba(249, 115, 22, 0.05)',
            previewBlockquoteBorder: 'rgba(249, 115, 22, 0.4)',
            previewTableBorder: 'rgba(251, 146, 60, 0.15)',
            previewTableHeaderBg: 'rgba(251, 146, 60, 0.05)',
            previewLinkColor: '#fb923c',
            scrollbarThumb: 'rgba(251, 146, 60, 0.12)',
            scrollbarThumbHover: 'rgba(251, 146, 60, 0.25)',
            hoverBg: 'rgba(251, 146, 60, 0.08)',
            activeBg: 'rgba(249, 115, 22, 0.1)',
        },
    },
];

export const defaultThemeId = 'midnight';
