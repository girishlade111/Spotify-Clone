'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { formatDuration } from '@/lib/formatters';

interface SliderProps {
  value: number;
  max: number;
  onChange: (value: number) => void;
  onChangeComplete?: (value: number) => void;
  showThumb?: boolean;
  color?: string;
  bufferedValue?: number;
  className?: string;
  height?: number;
  showTooltip?: boolean;
}

export function Slider({
  value,
  max,
  onChange,
  onChangeComplete,
  showThumb = false,
  color = '#1DB954',
  bufferedValue,
  className,
  height = 4,
  showTooltip = false,
}: SliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

  const percentage = max > 0 ? (value / max) * 100 : 0;
  const bufferedPercentage = bufferedValue !== undefined && max > 0
    ? (bufferedValue / max) * 100
    : 0;

  const handleValueChange = useCallback(
    (clientX: number) => {
      if (!containerRef.current || max === 0) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const newPercentage = Math.max(0, Math.min(1, x / rect.width));
      const newValue = Math.round(newPercentage * max);

      setLocalValue(newValue);
      onChange(newValue);
    },
    [max, onChange]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(true);
      handleValueChange(e.clientX);
    },
    [handleValueChange]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      handleValueChange(e.clientX);
    },
    [isDragging, handleValueChange]
  );

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      onChangeComplete?.(localValue);
    }
  }, [isDragging, localValue, onChangeComplete]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    if (!isDragging) {
      setLocalValue(value);
    }
  }, [value, isDragging]);

  const showActiveThumb = showThumb || isHovered || isDragging;

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative flex items-center w-full h-5 cursor-pointer group',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={handleMouseDown}
    >
      {/* Track background */}
      <div
        className="absolute left-0 right-0 rounded-full overflow-hidden"
        style={{ height: `${height}px` }}
      >
        {/* Buffered portion (optional) */}
        {bufferedValue !== undefined && (
          <div
            className="absolute top-0 h-full bg-white/15 rounded-full"
            style={{ width: `${bufferedPercentage}%` }}
          />
        )}

        {/* Filled portion */}
        <div
          className={cn(
            'absolute top-0 h-full rounded-full transition-colors duration-200',
            'group-hover:bg-[#1DB954]',
            isDragging ? 'bg-[#1DB954]' : 'bg-white'
          )}
          style={{ width: `${percentage}%` }}
        />

        {/* Base track (visible behind filled portion) */}
        <div
          className="absolute inset-0 bg-[#535353] rounded-full -z-10"
          style={{ width: '100%' }}
        />
      </div>

      {/* Thumb */}
      {showActiveThumb && (
        <div
          className="absolute w-3 h-3 bg-white rounded-full shadow-md pointer-events-none z-10 transition-opacity duration-200"
          style={{
            left: `${percentage}%`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      )}

      {/* Tooltip showing time during drag */}
      {showTooltip && isDragging && (
        <div
          className="absolute px-2 py-1 bg-[#282828] rounded text-xs text-white whitespace-nowrap pointer-events-none z-20"
          style={{
            left: `${percentage}%`,
            bottom: 'calc(100% + 8px)',
            transform: 'translateX(-50%)',
          }}
        >
          {formatDuration(localValue)}
        </div>
      )}

      {/* Invisible range input for accessibility */}
      <input
        type="range"
        min={0}
        max={max}
        value={localValue}
        onChange={(e) => {
          const value = parseInt(e.target.value, 10);
          setLocalValue(value);
          onChange(value);
        }}
        onMouseUp={() => onChangeComplete?.(localValue)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer m-0 p-0"
        aria-label="Slider control"
      />
    </div>
  );
}
