import { gql } from '@apollo/client'

export const GET_CUSTOMERS = gql`
query getCustomers($after: String) {
  customers(first: 2, after: $after) {
    edges {
      cursor
      node {
        id
        firstName
        lastName
        email
        tags
      }
    }
    pageInfo{
      hasNextPage
      hasPreviousPage
    }
  }
}
`
export const GET_CUSTOMER_METAFIELDS = gql`
  query getCustomerMetafields($id: ID!) {
    customer(id:$id){
      firstName
      tags
      metafields(first:50) {
        edges{
          node{
            id
            key 
            value
            namespace
          }
        }
      }
    }
  }
`

export const GET_CUSTOMER = gql`
  query getCustomer($email: String) {
    customers(first: 1, query: $email) {
      edges {
        node {
          id
          firstName
          lastName
          email
          metafields(first:50) {
            edges{
              node{
                id
                key 
                value
                namespace
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_PRODUCT_BY_SKU = gql`
query getProductBySku($count: Int!, $sku: String!){
  products(first:$count, query: $sku) {
    edges{
      node{
        id
        title
      }
    }
  }
}
`