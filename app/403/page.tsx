// app/403/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { ShieldAlert, Home, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ForbiddenPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-destructive/5 to-accent/5 px-4 text-center">
      <ShieldAlert className="h-14 w-14 text-destructive mb-4" />
      <h1 className="text-6xl font-bold text-primary mb-4">403</h1>
      <h2 className="text-2xl font-semibold text-foreground mb-2">
        Access Denied
      </h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        You don’t have permission to access this page.
      </p>

      <div className="flex gap-4">
        <Button
          variant="default"
          size="lg"
          className="flex items-center gap-2"
          onClick={() => router.push("/")}
        >
          <Home size={18} />
          Go Home
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="flex items-center gap-2"
          onClick={() => router.back()}
        >
          <ArrowLeft size={18} />
          Go Back
        </Button>
      </div>
    </div>
  );
}
