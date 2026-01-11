import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SocialShareBar from "@/components/content/SocialShareBar";
import { getPostBySlug } from "@/lib/wordpress/client";
import { articleSchema } from "@/lib/seo/schema";
import { createPageMetadata } from "@/lib/seo/metadata";
import { sanitizeWordPressHtml } from "@/lib/wordpress/sanitize";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 300;

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return createPageMetadata({
      title: "Article",
      description: "Article not found.",
      path: `/blog/${slug}`,
    });
  }

  const metadata = createPageMetadata({
    title: post.title,
    description: post.excerpt || post.title,
    path: `/blog/${post.slug}`,
  });

  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      type: "article",
      publishedTime: post.date,
      authors: [post.author?.node?.name || "Commergia"],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const sanitizedHtml = sanitizeWordPressHtml(post.content);
  const url = `https://commergia.sl177y.com/blog/${post.slug}`;
  const articleJsonLd = articleSchema({
    headline: post.title,
    description: post.excerpt || post.title,
    datePublished: post.date,
    authorName: post.author?.node?.name || "Commergia",
    url,
  });

  return (
    <article className="mx-auto my-8 max-w-3xl space-y-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <p className="text-xs uppercase tracking-wide text-gray-500">{new Date(post.date).toLocaleDateString()}</p>
      <h1 className="text-4xl font-bold leading-tight">{post.title}</h1>
      <p className="text-sm text-gray-600">By {post.author?.node?.name || "Commergia"}</p>

      <div
        className="prose prose-sm max-w-none prose-headings:font-semibold"
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      />

      <SocialShareBar title={post.title} url={url} />
    </article>
  );
}
