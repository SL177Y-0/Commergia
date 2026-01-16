import { gql } from "graphql-tag";

export const GET_PRODUCT_BY_HANDLE_QUERY = gql`
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      vendor
      description
      productType
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
      images(first: 10) {
        edges {
          node {
            url
            altText
            width
            height
          }
        }
      }
      options {
        name
        optionValues {
          id
          name
          swatch {
            color
          }
        }
      }
      variants(first: 100) {
        edges {
          node {
            id
            availableForSale
            compareAtPrice {
              amount
              currencyCode
            }
            price {
              amount
              currencyCode
            }
            selectedOptions {
              name
              value
            }
          }
        }
      }
      seo {
        title
        description
      }
    }
  }
`;

export const GET_RECOMMENDED_PRODUCTS_QUERY = gql`
  query GetRecommendedProducts($productId: ID!) {
    productRecommendations(productId: $productId) {
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
`;
