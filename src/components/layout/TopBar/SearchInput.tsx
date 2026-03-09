/**
 * Search Input Component
 */

"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

interface SearchInputProps {
  initialValue?: string;
  placeholder?: string;
  variant?: "full" | "small";
}

export function SearchInput({
  initialValue = "",
  placeholder = "What do you want to play?",
  variant = "full",
}: SearchInputProps) {
  const router = useRouter();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);

  // Debounced search navigation
  const debouncedNavigate = useDebouncedCallback((query: string) => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`, { scroll: false });
    } else if (pathname === "/search") {
      router.push("/search", { scroll: false });
    }
  }, 300);

  useEffect(() => {
    debouncedNavigate(value);
  }, [value, debouncedNavigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      router.push(`/search?q=${encodeURIComponent(value)}`);
    }
  };

  const handleClear = () => {
    setValue("");
    inputRef.current?.focus();
  };

  const isOnSearchPage = pathname === "/search";
  const hasValue = value.trim().length > 0;

  // Small variant for non-search pages
  if (variant === "small") {
    return (
      <button
        type="button"
        onClick={() => router.push("/search")}
        className="w-[200px] h-12 rounded-full bg-[#2A2A2A] text-white text-sm font-normal px-4 text-left hover:bg-[#3A3A3A] transition-colors"
      >
        <span className="text-[#A7A7A7]">{placeholder}</span>
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-[364px]">
      {/* Search icon */}
      <div className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[#727272]">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
          <path d="M10.5332 12.7H12.2065L17.7599 18.2537L18.9432 17.0704L13.3895 11.5167V9.84336C13.3895 6.38903 10.5838 3.58337 7.12949 3.58337C3.67516 3.58337 0.869492 6.38903 0.869492 9.84337C0.869492 13.2977 3.67516 16.1034 7.12949 16.1034C10.5838 16.1034 13.3895 13.2977 13.3895 9.84337H11.7162C11.7162 12.3774 9.66354 14.43 7.12949 14.43C4.59544 14.43 2.54282 12.3774 2.54282 9.84337C2.54282 7.30931 4.59544 5.2567 7.12949 5.2567C9.66354 5.2567 11.7162 7.30931 11.7162 9.84337H10.5332Z" />
        </svg>
      </div>

      {/* Input */}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="w-full h-12 rounded-full bg-white text-black pl-[48px] pr-[48px] text-sm font-normal placeholder:text-[#727272] border-2 border-transparent focus:border-white focus:outline-none transition-colors"
      />

      {/* Clear button */}
      {hasValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#727272] hover:text-black transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.59-13L12 10.59 8.41 7 7 8.41 10.59 12 7 15.59 8.41 17 12 13.41 15.59 17 17 15.59 13.41 12 17 8.41 15.59 7z" />
          </svg>
        </button>
      )}

      {/* Browse button (shows when input is empty) */}
      {!hasValue && (
        <button
          type="button"
          onClick={() => router.push("/search")}
          className="absolute right-2 top-1/2 -translate-y-1/2 h-[44px] rounded-full bg-[#2A2A2A] text-white text-sm font-bold px-4 hover:bg-[#3A3A3A] transition-colors"
        >
          Browse
        </button>
      )}
    </form>
  );
}
