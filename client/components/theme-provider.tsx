"use client";import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// Import the correct type directly from next-themes
import { ThemeProviderProps } from "next-themes";

// Use the correct types from next-themes
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
