/**
 * NextAuth Configuration
 */

import NextAuth from "next-auth";
import Spotify from "next-auth/providers/spotify";
import type { JWT } from "next-auth/jwt";

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;

const SCOPES = [
  "user-read-email",
  "user-read-private",
  "streaming",
  "user-library-read",
  "user-library-modify",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "user-read-recently-played",
  "user-follow-read",
  "user-follow-modify",
  "playlist-read-private",
  "playlist-read-collaborative",
  "playlist-modify-public",
  "playlist-modify-private",
  "user-top-read",
  "ugc-image-upload",
].join(" ");

async function refreshAccessToken(token: {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}): Promise<{
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
} | null> {
  try {
    const url = new URL("https://accounts.spotify.com/api/token");
    url.searchParams.append("grant_type", "refresh_token");
    url.searchParams.append("refresh_token", token.refreshToken);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
        ).toString("base64")}`,
      },
      body: url.searchParams.toString(),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw new Error(refreshedTokens.error?.message || "Token refresh failed");
    }

    return {
      accessToken: refreshedTokens.access_token,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
      expiresAt: Date.now() + refreshedTokens.expires_in * 1000,
    };
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return null;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Spotify({
      clientId: SPOTIFY_CLIENT_ID,
      clientSecret: SPOTIFY_CLIENT_SECRET,
      authorization: {
        params: {
          scope: SCOPES,
          show_dialog: "false",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const newToken: JWT = {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          expiresAt: Date.now() + (account.expires_in ?? 3600) * 1000,
          userId: profile.id as string,
          username: (profile.display_name as string) ?? (profile.id as string),
        };
        return newToken;
      }

      if (token.expiresAt && Date.now() > token.expiresAt - 60000) {
        const refreshed = await refreshAccessToken({
          accessToken: token.accessToken as string,
          refreshToken: token.refreshToken as string,
          expiresAt: token.expiresAt as number,
        });

        if (refreshed) {
          const newToken: JWT = {
            ...token,
            accessToken: refreshed.accessToken,
            refreshToken: refreshed.refreshToken,
            expiresAt: refreshed.expiresAt,
          };
          return newToken;
        } else {
          const newToken: JWT = {
            ...token,
            error: "RefreshAccessTokenError",
          };
          return newToken;
        }
      }

      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        accessToken: token.accessToken as string,
        error: token.error as string,
        userId: token.userId as string,
        username: token.username as string,
      };
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  debug: process.env.NODE_ENV === "development",
});

export async function getServerSession() {
  return auth();
}

export async function getAccessToken() {
  const session = await getServerSession();
  return session?.accessToken ?? null;
}
