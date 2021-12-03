import { gql } from '@apollo/client'

export const ADD_METAFIELD = gql`
mutation createMetafield($input: CustomerInput!) {
  customerUpdate(input: $input) {
    customer {
      id
    }
    userErrors {
      field
      message
    }
  }
}
`
export const UPDATE_METAFIELD = gql`
mutation updateMetafield($input: CustomerInput!) {
  customerUpdate(input: $input) {
    customer {
      id
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