"use client";

import { SessionProvider } from "next-auth/react";
import { DashboardContextProvider } from "./context/DashboardContext";
import ThemeWrapper from "@/components/molecules/ThemeWrapper";

export function Providers({ children }) {
  return (
    <DashboardContextProvider> 
      <SessionProvider>
        <ThemeWrapper>{children}</ThemeWrapper>
      </SessionProvider>
    </DashboardContextProvider>
  );
}
