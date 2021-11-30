import { gql } from '@apollo/client'

export const ADD_METAFIELD = gql`
mutation customerUpdate($input: CustomerInput!) {
  customerUpdate(input: $input) {
    customer {
      id
      metafields(first:5) {
        edges{
          node{
            id
            key 
            value
            namespace
            valueType
          }
        }
      }
    }
    userErrors {
      field
      message
    }
  }
}
`

export const DELETE_METAFIELDS = gql`
mutation metafieldDelete($input: MetafieldDeleteInput!) {
  metafieldDelete(input: $input) {
    deletedId 
    userErrors {
      field
      message
    }
  }
}
`