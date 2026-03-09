/**
 * User Menu Component
 */

"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export function UserMenu() {
  const router = useRouter();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/login" });
  };

  const getInitial = () => {
    if (user?.display_name) {
      return user.display_name.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 rounded-full flex items-center justify-center hover:outline hover:outline-2 hover:outline-white/30 transition-all"
      >
        {user?.images && user.images.length > 0 && user.images[0].url ? (
          <Image
            src={user.images[0].url}
            alt={user.display_name || "User"}
            width={32}
            height={32}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-[#535353] flex items-center justify-center">
            <span className="text-sm font-bold text-white">{getInitial()}</span>
          </div>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-[44px] w-[196px] bg-[#282828] rounded-[4px] shadow-[0_16px_24px_rgba(0,0,0,0.3)] z-[1000] overflow-hidden">
          <div className="py-1">
            {/* Account */}
            <a
              href="https://www.spotify.com/account"
              target="_blank"
              rel="noopener noreferrer"
              className="h-12 px-3 flex items-center justify-between text-sm text-[#EBEBEB] hover:bg-white/10 transition-colors"
            >
              <span>Account</span>
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
              </svg>
            </a>

            {/* Profile */}
            <button
              type="button"
              onClick={() => {
                if (user?.id) {
                  router.push(`/user/${user.id}`);
                  setIsOpen(false);
                }
              }}
              className="w-full h-12 px-3 flex items-center justify-between text-sm text-[#EBEBEB] hover:bg-white/10 transition-colors"
            >
              <span>Profile</span>
            </button>

            {/* Upgrade to Premium (only for non-premium users) */}
            {user?.product !== "premium" && (
              <a
                href="https://www.spotify.com/premium"
                target="_blank"
                rel="noopener noreferrer"
                className="h-12 px-3 flex items-center justify-between text-sm text-[#EBEBEB] hover:bg-white/10 transition-colors"
              >
                <span>Upgrade to Premium</span>
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
                </svg>
              </a>
            )}

            {/* Support */}
            <a
              href="https://support.spotify.com"
              target="_blank"
              rel="noopener noreferrer"
              className="h-12 px-3 flex items-center justify-between text-sm text-[#EBEBEB] hover:bg-white/10 transition-colors"
            >
              <span>Support</span>
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
              </svg>
            </a>

            {/* Download */}
            <a
              href="https://www.spotify.com/download"
              target="_blank"
              rel="noopener noreferrer"
              className="h-12 px-3 flex items-center justify-between text-sm text-[#EBEBEB] hover:bg-white/10 transition-colors"
            >
              <span>Download</span>
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
              </svg>
            </a>

            {/* Divider */}
            <div className="h-px bg-white/10 my-1" />

            {/* Settings */}
            <button
              type="button"
              onClick={() => {
                router.push("/settings");
                setIsOpen(false);
              }}
              className="w-full h-12 px-3 flex items-center justify-between text-sm text-[#EBEBEB] hover:bg-white/10 transition-colors"
            >
              <span>Settings</span>
            </button>

            {/* Divider */}
            <div className="h-px bg-white/10 my-1" />

            {/* Log out */}
            <button
              type="button"
              onClick={handleLogout}
              className="w-full h-12 px-3 flex items-center justify-between text-sm text-[#EBEBEB] hover:bg-white/10 transition-colors"
            >
              <span>Log out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
