import Image from "next/image";
import { instagramCards } from "@/lib/site-data";

export default function InstagramFeed() {
  return (
    <section className="mt-12">
      <div className="mb-4 flex items-end justify-between">
        <h2 className="text-2xl font-semibold">Instagram</h2>
        <a className="text-sm font-medium underline underline-offset-4" href="https://instagram.com" target="_blank" rel="noreferrer">
          Follow @commergia
        </a>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {instagramCards.map((card) => (
          <article className="group relative h-52 overflow-hidden rounded-xl" key={card.id}>
            <Image src={card.image} alt={card.caption} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
            <div className="absolute inset-x-0 bottom-0 bg-black/45 p-2 text-xs text-white">{card.caption}</div>
          </article>
        ))}
      </div>
    </section>
  );
}
