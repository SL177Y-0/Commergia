import Link from "next/link";
import { cn } from "@/lib/utils";

const Logo = ({ className }: { className?: string }) => {
  return (
    <Link
      className={cn("inline-flex items-center gap-2 text-lg font-black uppercase tracking-[0.18em]", className)}
      href="/"
      aria-label="Commergia home"
    >
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-sm bg-gray-900 text-xs text-white">
        CG
      </span>
      Commergia
    </Link>
  );
};

export default Logo;
