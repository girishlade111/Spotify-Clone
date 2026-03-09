/**
 * Toggle Switch Component
 */

"use client";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
}

export function ToggleSwitch({ checked, onChange, disabled = false, id }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      id={id}
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`
        relative w-11 h-6 rounded-full transition-colors duration-200
        ${checked ? "bg-[#1DB954]" : "bg-[#535353]"}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-white
      `}
    >
      <span
        className={`
          absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white
          shadow-[0_1px_3px_rgba(0,0,0,0.3)]
          transition-all duration-200
          ${checked ? "translate-x-5" : "translate-x-0"}
        `}
      />
    </button>
  );
}
