import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { Providers } from "@/components/providers/Providers";
import "./globals.css";

const figtree = Figtree({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Spotify - Web Player",
  description: "Spotify - Web Player: Listen to your favorite songs online for free.",
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
