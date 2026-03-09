import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter, Geist_Mono } from "next/font/google";

import "./globals.css";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ElevenLabs Clone",
    template: "%s | ElevenLabs Clone",
  },
  description:
    "An AI-powered text-to-speech platform that lets users create, edit, and share voice content.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${geistMono.variable} antialiased`}>
        <ClerkProvider>
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster />
        </ClerkProvider>
      </body>
    </html>
  );
}
