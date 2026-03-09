import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { Toaster } from "react-hot-toast";

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-figtree",
});

export const metadata: Metadata = {
  title: "Spotify - Web Player",
  description: "Spotify - Web Player: Listen to music on your web browser",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={figtree.variable}>
      <body className="font-figtree antialiased">
        <Providers>
          {children}
          <Toaster
            position="bottom-left"
            toastOptions={{
              style: {
                background: "#333333",
                color: "#FFFFFF",
                borderRadius: "4px",
                fontSize: "14px",
                padding: "12px 16px",
              },
              duration: 3000,
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
