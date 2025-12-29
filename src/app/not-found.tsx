import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto my-14 max-w-xl rounded-xl border border-dashed border-gray-300 p-10 text-center">
      <p className="text-xs uppercase tracking-wide text-gray-500">404</p>
      <h1 className="mt-2 text-3xl font-bold">Page not found</h1>
      <p className="mt-3 text-sm text-gray-600">
        The page you requested does not exist or was moved during the Commergia merge.
      </p>
      <div className="mt-6 flex items-center justify-center gap-2">
        <Button asChild>
          <Link href="/">Back to home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/search">Search products</Link>
        </Button>
      </div>
    </div>
  );
}
