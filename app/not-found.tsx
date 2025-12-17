// app/not-found.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFoundPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-primary/5 to-accent/5 px-4 text-center">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-foreground mb-2">
        Page Not Found
      </h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        Oops! The page you’re looking for doesn’t exist or may have been moved.
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
