'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useUIStore } from '@/store/uiStore';
import { cn } from '@/lib/utils';

interface ResizeHandleProps {
  className?: string;
}

export function ResizeHandle({ className }: ResizeHandleProps) {
  const setSidebarWidth = useUIStore((state) => state.setSidebarWidth);
  const isDraggingRef = useRef(false);

  const handleMouseDown = useCallback(() => {
    isDraggingRef.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      // Subtract left padding (8px) from clientX to get actual sidebar width
      const newWidth = e.clientX - 8;
      setSidebarWidth(newWidth);
    },
    [setSidebarWidth]
  );

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div
      className={cn(
        'absolute top-0 right-0 h-full w-4 cursor-col-resize z-20',
        'flex items-center justify-center',
        className
      )}
      onMouseDown={handleMouseDown}
    >
      {/* Visual indicator - 2px wide semi-transparent line */}
      <div
        className={cn(
          'h-full w-[2px]',
          'bg-white/10',
          'transition-colors duration-150',
          'hover:bg-white/40',
          'active:bg-[#1DB954]'
        )}
      />
    </div>
  );
}
