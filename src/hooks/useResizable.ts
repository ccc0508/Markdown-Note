import { useState, useCallback, useRef, useEffect } from 'react';

interface UseResizableOptions {
    initialSize: number;
    minSize: number;
    maxSize: number;
    direction: 'left' | 'right';
    storageKey?: string;
    /** 提供容器 ref 时，delta 会按容器宽度转换成百分比 */
    containerRef?: React.RefObject<HTMLElement | null>;
}

export function useResizable({
    initialSize,
    minSize,
    maxSize,
    direction,
    storageKey,
    containerRef,
}: UseResizableOptions) {
    const [size, setSize] = useState<number>(() => {
        if (storageKey) {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                const parsed = Number(saved);
                if (!isNaN(parsed) && parsed >= minSize && parsed <= maxSize) {
                    return parsed;
                }
            }
        }
        return initialSize;
    });

    const isResizing = useRef(false);
    const startX = useRef(0);
    const startSize = useRef(0);

    // 持久化
    useEffect(() => {
        if (storageKey) {
            localStorage.setItem(storageKey, String(Math.round(size * 100) / 100));
        }
    }, [size, storageKey]);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        isResizing.current = true;
        startX.current = e.clientX;
        startSize.current = size;
        document.documentElement.classList.add('is-resizing');
        document.body.style.userSelect = 'none';

        // 记录容器宽度（用于像素→百分比转换）
        const containerWidth = containerRef?.current?.offsetWidth || 1;

        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing.current) return;
            let delta = e.clientX - startX.current;
            // 如果提供了容器 ref，将像素转换为百分比
            if (containerRef) {
                delta = (delta / containerWidth) * 100;
            }
            const newSize = direction === 'left'
                ? startSize.current + delta
                : startSize.current - delta;
            setSize(Math.min(maxSize, Math.max(minSize, newSize)));
        };

        const handleMouseUp = () => {
            isResizing.current = false;
            document.documentElement.classList.remove('is-resizing');
            document.body.style.userSelect = '';
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, [size, minSize, maxSize, direction, containerRef]);

    return { size, handleMouseDown };
}
