"use client";

import Link from "next/link";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  console.error(error);

  return (
    <html>
      <body className="bg-white text-gray-900">
        <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center p-6 text-center">
          <h1 className="text-3xl font-bold">Critical application error</h1>
          <p className="mt-3 text-sm text-gray-600">
            A global runtime error was detected. Please refresh or start from home.
          </p>
          <Link className="mt-6 rounded-md bg-gray-900 px-4 py-2 text-white" href="/">
            Go to home
          </Link>
        </main>
      </body>
    </html>
  );
}
