import type { Note } from '../types/note';

const STORAGE_KEY = 'markdown-notes-app';
const IMAGE_STORAGE_KEY = 'markdown-notes-images';

export const storage = {
    getNotes(): Note[] {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch {
            console.error('Failed to parse notes from LocalStorage');
            return [];
        }
    },

    saveNotes(notes: Note[]): void {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
        } catch {
            console.error('Failed to save notes to LocalStorage');
        }
    },
};

// 图片独立存储：短 ID → Base64 data URL
export const imageStorage = {
    _getAll(): Record<string, string> {
        try {
            const data = localStorage.getItem(IMAGE_STORAGE_KEY);
            return data ? JSON.parse(data) : {};
        } catch {
            return {};
        }
    },

    _saveAll(images: Record<string, string>): void {
        try {
            localStorage.setItem(IMAGE_STORAGE_KEY, JSON.stringify(images));
        } catch {
            console.error('Failed to save images to LocalStorage');
        }
    },

    /** 存储图片，返回短 ID */
    save(base64: string): string {
        const id = crypto.randomUUID().slice(0, 8);
        const images = this._getAll();
        images[id] = base64;
        this._saveAll(images);
        return id;
    },

    /** 通过短 ID 获取 Base64 */
    get(id: string): string | null {
        return this._getAll()[id] ?? null;
    },

    /** 解析 Markdown 中的 img:xxx 引用，替换为实际 Base64 */
    resolveContent(content: string): string {
        const images = this._getAll();
        return content.replace(/img:([a-f0-9]{8})/g, (_match, id) => {
            return images[id] || `img:${id}`;
        });
    },
};

