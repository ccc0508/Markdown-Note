import { useState, useCallback, useRef, useEffect } from 'react';

interface UseResizableOptions {
    initialSize: number;
    minSize: number;
    maxSize: number;
    direction: 'left' | 'right'; // which side the handle is on
    storageKey?: string;
}

export function useResizable({
    initialSize,
    minSize,
    maxSize,
    direction,
    storageKey,
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
            localStorage.setItem(storageKey, String(size));
        }
    }, [size, storageKey]);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        isResizing.current = true;
        startX.current = e.clientX;
        startSize.current = size;
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';

        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing.current) return;
            const delta = e.clientX - startX.current;
            const newSize = direction === 'left'
                ? startSize.current + delta
                : startSize.current - delta;
            setSize(Math.min(maxSize, Math.max(minSize, newSize)));
        };

        const handleMouseUp = () => {
            isResizing.current = false;
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, [size, minSize, maxSize, direction]);

    return { size, handleMouseDown };
}
