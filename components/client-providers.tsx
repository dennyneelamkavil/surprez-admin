// components/Providers.tsx
"use client";

import type { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "./auth-provider";

export function Providers({ children }: { children: ReactNode }) {
  // You can pass `session={pageProps.session}` if you fetch the session on the server
  // For most apps, leaving it empty is fine and NextAuth will read cookies.
  return (
    <SessionProvider>
      <AuthProvider>{children}</AuthProvider>
    </SessionProvider>
  );
}
