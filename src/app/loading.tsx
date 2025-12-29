export default function Loading() {
  return (
    <div className="my-12 space-y-3">
      <div className="h-6 w-48 animate-pulse rounded bg-gray-200" />
      <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
      <div className="h-4 w-4/5 animate-pulse rounded bg-gray-100" />
      <div className="h-4 w-3/5 animate-pulse rounded bg-gray-100" />
    </div>
  );
}
