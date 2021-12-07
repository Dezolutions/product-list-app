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

export const ADD_TAG = gql`
mutation tagsAdd($id: ID!, $tags: [String!]!) {
  tagsAdd(id: $id, tags: $tags) {
    node {
      id
    }
    userErrors {
      field
      message
    }
  }
}
`

export const REMOVE_TAG = gql`
mutation tagsRemove($id: ID!, $tags: [String!]!) {
  tagsRemove(id: $id, tags: $tags) {
    node {
      id
    }
    userErrors {
      field
      message
    }
  }
}
`