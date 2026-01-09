import { gql } from "graphql-tag";

export const SEARCH_PRODUCTS_QUERY = gql`
  query SearchProducts($query: String!, $first: Int!, $sortKey: ProductSortKeys, $reverse: Boolean) {
    products(query: $query, first: $first, sortKey: $sortKey, reverse: $reverse) {
      edges {
        node {
          id
          handle
          title
          description
          productType
          vendor
          featuredImage {
            url
            altText
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          variants(first: 1) {
            edges {
              node {
                id
                availableForSale
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const PREDICTIVE_SEARCH_QUERY = gql`
  query PredictiveSearch($query: String!, $limit: Int!) {
    predictiveSearch(query: $query, limit: $limit, types: [PRODUCT]) {
      products {
        id
        handle
        title
      }
    }
  }
`;

export const GET_TRENDING_PRODUCTS_QUERY = gql`
  query GetTrendingProducts($first: Int!) {
    products(first: $first, sortKey: BEST_SELLING) {
      edges {
        node {
          id
          handle
          title
          description
          vendor
          featuredImage {
            url
            altText
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          variants(first: 1) {
            edges {
              node {
                id
              }
            }
          }
        }
      }
    }
  }
`;
