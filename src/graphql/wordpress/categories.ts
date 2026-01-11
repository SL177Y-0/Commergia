export const GET_POST_CATEGORIES_QUERY = `
  query GetPostCategories {
    categories(first: 50) {
      nodes {
        id
        slug
        name
      }
    }
  }
`;
