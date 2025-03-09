"use client";

import { ClerkProvider } from "@clerk/nextjs";
import {dark} from '@clerk/themes'
import { useThemeContext

 } from "./shadeTheme-provider";
export default function ClientTheme({ children }: { children: React.ReactNode }) {
    const { currentTheme } = useThemeContext();


  return (
    <ClerkProvider {...(currentTheme === 'dark' ? { appearance: { baseTheme: dark } } : {})}>
      {children}
    </ClerkProvider>
  );
}
