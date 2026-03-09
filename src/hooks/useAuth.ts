/**
 * useAuth Hook
 */

"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import type { SpotifyUser } from "@/types/spotify";

interface UseAuthReturn {
  user: SpotifyUser | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  logout: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const { data: session, status } = useSession();

  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";
  const error = (session as { error?: string })?.error ?? null;

  useEffect(() => {
    if ((session as { error?: string })?.error === "RefreshAccessTokenError") {
      signOut({ redirect: true, callbackUrl: "/login" });
    }
  }, [session]);

  const user: SpotifyUser | null = session?.user
    ? {
        id: (session.user as { id?: string }).id ?? "",
        display_name: session.user.name ?? null,
        email: (session.user as { email?: string }).email,
        images: (session.user as { image?: string }).image
          ? [{ url: (session.user as { image?: string }).image!, height: null, width: null }]
          : [],
        followers: { href: null, total: 0 },
        product: "premium" as const,
        country: "",
        uri: "",
        type: "user" as const,
        external_urls: { spotify: "" },
      }
    : null;

  const logout = async () => {
    await signOut({ redirect: true, callbackUrl: "/login" });
  };

  return {
    user,
    accessToken: (session as { accessToken?: string })?.accessToken ?? null,
    isLoading,
    isAuthenticated,
    error,
    logout,
  };
}

export function usePremiumCheck(): boolean {
  const { user } = useAuth();
  return user?.product === "premium";
}

export function useUserName(): string {
  const { user } = useAuth();
  return user?.display_name ?? user?.email ?? "User";
}
