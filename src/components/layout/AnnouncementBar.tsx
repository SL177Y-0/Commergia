export default function AnnouncementBar() {
  return (
    <div className="border-b border-gray-200 bg-gray-900 text-xs text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 md:px-6">
        <p>Call us: +1 (212) 555-0199</p>
        <p className="hidden md:block">Free shipping on orders over $75</p>
        <p>USD / INR</p>
      </div>
    </div>
  );
}
