"use client";

import { Facebook, Linkedin, Pin, Share2, Twitter } from "lucide-react";

type SocialShareBarProps = {
  url: string;
  title: string;
};

const iconClass = "h-4 w-4";

export default function SocialShareBar({ url, title }: SocialShareBarProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    { href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, icon: <Facebook className={iconClass} />, label: "Share on Facebook" },
    { href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`, icon: <Twitter className={iconClass} />, label: "Share on X" },
    { href: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`, icon: <Pin className={iconClass} />, label: "Share on Pinterest" },
    { href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, icon: <Linkedin className={iconClass} />, label: "Share on LinkedIn" },
  ];

  return (
    <div className="mt-8 flex items-center gap-2">
      <span className="inline-flex items-center gap-1 text-xs uppercase tracking-wide text-gray-500">
        <Share2 className="h-3 w-3" /> Share
      </span>
      {links.map((link) => (
        <a
          key={link.href}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-700 hover:bg-gray-900 hover:text-white"
          href={link.href}
          target="_blank"
          rel="noreferrer"
          aria-label={link.label}
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
}
