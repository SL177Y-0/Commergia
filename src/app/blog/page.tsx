import BlogCard from "@/components/content/BlogCard";
import NewsletterSignup from "@/components/content/NewsletterSignup";
import Link from "next/link";
import { createPageMetadata } from "@/lib/seo/metadata";
import { blogCategories } from "@/lib/site-data";
import { getPosts } from "@/lib/wordpress/client";

export const revalidate = 300;
export const metadata = createPageMetadata({
  title: "Blog",
  description: "Commerce architecture, product strategy, and operational playbooks.",
  path: "/blog",
});

export default async function BlogPage() {
  const posts = await getPosts(12);
  const recentPosts = posts.nodes.slice(0, 4);

  return (
    <div className="my-8 space-y-6">
      <h1 className="text-3xl font-bold">Blog</h1>
      <p className="text-sm text-gray-600">Commerce architecture, product strategy, and operational playbooks.</p>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="grid gap-4 sm:grid-cols-2">
          {posts.nodes.map((post) => (
            <BlogCard
              key={post.id}
              post={{
                slug: post.slug,
                title: post.title,
                excerpt: post.excerpt,
                date: post.date,
                author: post.author?.node?.name || "Commergia",
                contentHtml: post.content,
              }}
            />
          ))}
        </div>

        <aside className="space-y-4">
          <section className="rounded-xl border border-gray-200 p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Categories</h2>
            <ul className="mt-2 space-y-1 text-sm">
              {blogCategories.map((category) => (
                <li key={category}>{category}</li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl border border-gray-200 p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Recent Posts</h2>
            <ul className="mt-2 space-y-2 text-sm">
              {recentPosts.map((post) => (
                <li key={`recent-${post.id}`}>
                  <Link className="underline underline-offset-2" href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl border border-gray-200 p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Newsletter</h2>
            <div className="mt-2">
              <NewsletterSignup tone="light" />
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
