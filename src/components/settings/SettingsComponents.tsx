'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SettingsSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function SettingsSection({ title, children, className }: SettingsSectionProps) {
  return (
    <section className={cn('mb-8', className)}>
      <h2 className="text-xl font-bold text-white pb-2 mb-4 border-b border-white/10">
        {title}
      </h2>
      {children}
    </section>
  );
}

interface SettingsRowProps {
  label: string;
  description?: string;
  control: ReactNode;
  className?: string;
}

export function SettingsRow({ label, description, control, className }: SettingsRowProps) {
  return (
    <div
      className={cn(
        'flex justify-between items-center py-4 border-b border-white/10 last:border-0',
        className
      )}
    >
      <div className="flex-1">
        <div className="text-base font-medium text-white">{label}</div>
        {description && (
          <div className="text-sm text-[#A7A7A7] mt-1">{description}</div>
        )}
      </div>
      <div className="ml-4">{control}</div>
    </div>
  );
}

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  'aria-label'?: string;
}

export function ToggleSwitch({
  checked,
  onChange,
  disabled = false,
  'aria-label': ariaLabel,
}: ToggleSwitchProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          !disabled && onChange(!checked);
        }
      }}
      className={cn(
        'relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white',
        checked ? 'bg-[#1DB954]' : 'bg-[#535353]',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200',
          checked ? 'translate-x-5' : 'translate-x-0'
        )}
      />
    </button>
  );
}

interface SelectControlProps {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  'aria-label'?: string;
  className?: string;
}

export function SelectControl({
  value,
  onChange,
  options,
  'aria-label': ariaLabel,
  className,
}: SelectControlProps) {
  return (
    <div className={cn('relative', className)}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={ariaLabel}
        className="appearance-none bg-[#3E3E3E] text-white border border-[#727272] rounded px-3 py-2 pr-10 text-sm cursor-pointer focus:outline-none focus:border-white transition-colors"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A7A7A7] pointer-events-none"
      >
        <path d="M7 10l5 5 5-5z" />
      </svg>
    </div>
  );
}

interface SliderControlProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
  'aria-label'?: string;
}

export function SliderControl({
  value,
  min,
  max,
  onChange,
  formatValue = (v) => v.toString(),
  'aria-label': ariaLabel,
}: SliderControlProps) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={ariaLabel}
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        className="w-32 h-1 bg-[#535353] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
      />
      <span className="text-sm text-[#A7A7A7] w-12 text-right">{formatValue(value)}</span>
    </div>
  );
}
