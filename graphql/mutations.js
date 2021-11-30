import { gql } from '@apollo/client'

export const GET_CUSTOMERS = gql`
query getCustomers {
  customers(first: 10) {
    edges {
      node {
        id
        firstName
        lastName
        email
        metafields(first:10) {
          edges{
            node{
              id
              key 
              value

            }
          }
        }
      }
    }
  }
}
`