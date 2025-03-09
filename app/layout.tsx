import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import ClientTheme from "@/components/client-theme";
import { ShadeThemeProvider } from "@/components/shadeTheme-provider";
import { ToastProvider } from "@/components/toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Modern Chatbot Platform",
  description:
    "Professional, responsive chatbot platform with admin and guest interfaces",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ShadeThemeProvider>
          <ClientTheme>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange={false}
            >
              <ToastProvider>{children}</ToastProvider>
            </ThemeProvider>
          </ClientTheme>
        </ShadeThemeProvider>
      </body>
    </html>
  );
}
