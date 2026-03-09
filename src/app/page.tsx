"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Home() {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen w-full bg-[#121212] flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#121212] flex items-center justify-center">
      <div className="text-white text-lg">
        Welcome to Spotify Web Player Clone
        <br />
        <span className="text-[#1DB954]">Part 1 Complete - Foundation & Auth</span>
      </div>
    </div>
  );
}
