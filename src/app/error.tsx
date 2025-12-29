"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto my-16 max-w-xl rounded-xl border border-red-200 bg-red-50 p-6 text-center">
      <h2 className="text-2xl font-semibold text-red-700">Something went wrong</h2>
      <p className="mt-2 text-sm text-red-700/80">
        We could not complete this request. Try again or return to the homepage.
      </p>
      <div className="mt-6 flex items-center justify-center gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button asChild variant="outline">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
}
