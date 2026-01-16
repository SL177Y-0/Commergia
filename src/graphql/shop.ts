import { gql } from "graphql-tag";

export const GET_SHOP_INFO = gql`
  query GetShopInfo {
    shop {
      name
      description
      primaryDomain {
        url
      }
      shipsToCountries
      paymentSettings {
        acceptedCardBrands
        countryCode
        currencyCode
      }
      termsOfService {
        title
        url
      }
      privacyPolicy {
        title
        url
      }
      refundPolicy {
        title
        url
      }
      shippingPolicy {
        title
        url
      }
    }
  }
`;
