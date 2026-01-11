import Link from "next/link";
import { BlogPostFallback } from "@/lib/site-data";

type BlogCardProps = {
  post: BlogPostFallback;
};

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="rounded-xl border border-gray-200 p-5">
      <p className="text-xs uppercase tracking-wide text-gray-500">{new Date(post.date).toLocaleDateString()}</p>
      <h2 className="mt-2 text-xl font-semibold">{post.title}</h2>
      <p className="mt-2 text-sm text-gray-600">{post.excerpt}</p>
      <Link className="mt-4 inline-flex text-sm font-semibold text-gray-900 underline underline-offset-4" href={`/blog/${post.slug}`}>
        Read article
      </Link>
    </article>
  );
}
