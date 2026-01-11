export const GET_PAGE_BY_SLUG_QUERY = `
  query GetPageBySlug($slug: ID!) {
    page(id: $slug, idType: URI) {
      id
      title
      content
      slug
    }
  }
`;
