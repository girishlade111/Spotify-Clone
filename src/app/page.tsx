/**
 * Root Page - Redirects to login or main app based on auth status
 */

"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SpotifyLogo } from "@/components/ui/SpotifyLogo";

export default function RootPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    } else if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen w-full bg-[#121212] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <SpotifyLogo className="w-[200px] h-[60px]" />
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-[#1DB954] rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
            <div className="w-2 h-2 bg-[#1DB954] rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
            <div className="w-2 h-2 bg-[#1DB954] rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
          </div>
        </div>
      </div>
    );
  }

  return null;
}
