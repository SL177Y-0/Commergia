import { fallbackPosts } from "@/lib/site-data";
import { GET_POSTS_QUERY, GET_POST_BY_SLUG_QUERY } from "@/graphql/wordpress/posts";
import { GET_PAGE_BY_SLUG_QUERY } from "@/graphql/wordpress/pages";

export type WordPressPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author?: { node?: { name?: string } };
};

type PostsResponse = {
  posts?: {
    nodes: WordPressPost[];
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
  };
};

type PostBySlugResponse = {
  post?: WordPressPost | null;
};

type PageResponse = {
  page?: {
    id: string;
    title: string;
    content: string;
    slug: string;
  } | null;
};

export async function wpFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const endpoint = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

  if (!endpoint) {
    throw new Error("NEXT_PUBLIC_WORDPRESS_API_URL is not configured");
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`WPGraphQL request failed: ${response.status}`);
  }

  const payload = (await response.json()) as { data?: T; errors?: Array<{ message: string }> };
  if (payload.errors?.length) {
    throw new Error(payload.errors[0].message);
  }

  if (!payload.data) {
    throw new Error("WPGraphQL response missing data");
  }

  return payload.data;
}

export async function getPosts(first = 9, after?: string) {
  try {
    const data = await wpFetch<PostsResponse>(GET_POSTS_QUERY, { first, after });
    const posts = data.posts?.nodes || [];

    if (!posts.length) {
      return {
        nodes: fallbackPosts.map((post, index) => ({
          id: `fallback-${index}`,
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          content: post.contentHtml,
          date: post.date,
          author: { node: { name: post.author } },
        })),
        pageInfo: { hasNextPage: false, endCursor: null },
      };
    }

    return {
      nodes: posts,
      pageInfo: data.posts?.pageInfo || { hasNextPage: false, endCursor: null },
    };
  } catch {
    return {
      nodes: fallbackPosts.map((post, index) => ({
        id: `fallback-${index}`,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.contentHtml,
        date: post.date,
        author: { node: { name: post.author } },
      })),
      pageInfo: { hasNextPage: false, endCursor: null },
    };
  }
}

export async function getPostBySlug(slug: string) {
  try {
    const data = await wpFetch<PostBySlugResponse>(GET_POST_BY_SLUG_QUERY, { slug });
    if (data.post) return data.post;
  } catch {
    // Fallback below
  }

  const fallback = fallbackPosts.find((post) => post.slug === slug);
  if (!fallback) return null;

  return {
    id: `fallback-${slug}`,
    slug: fallback.slug,
    title: fallback.title,
    excerpt: fallback.excerpt,
    content: fallback.contentHtml,
    date: fallback.date,
    author: { node: { name: fallback.author } },
  };
}

export async function getPage(slug: string) {
  try {
    const data = await wpFetch<PageResponse>(GET_PAGE_BY_SLUG_QUERY, { slug: `/${slug}` });
    return data.page || null;
  } catch {
    return null;
  }
}
