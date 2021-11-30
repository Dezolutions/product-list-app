import React from 'react'
import { Button, TextField, List } from '@shopify/polaris'
import styles from './metafield.module.css'
import { useMutation } from '@apollo/client'
import { ADD_METAFIELD, DELETE_METAFIELDS } from '../../graphql/mutations'
import { GET_CUSTOMERS } from "../../graphql/queries";

const Metafield = ({node, customerId, onDelete}) => {

  const [key, setKey] = React.useState(node.key)
  const [value, setValue] = React.useState(node.value)
  const onSetKey = React.useCallback((newValue) => setKey(newValue), []);
  const onSetValue = React.useCallback((newValue) => setValue(newValue), []);

  const [customerUpdate] = useMutation(ADD_METAFIELD,{refetchQueries:[
    {query: GET_CUSTOMERS}
  ]})
  const [metafieldDelete] = useMutation(DELETE_METAFIELDS,{refetchQueries:[
    {query: GET_CUSTOMERS}
  ]})
  const onCustomerUpdate = () => {
    customerUpdate({variables: {
      input: {
        id: customerId,
        metafields: {
          id: node?.id,
          key: key,
          value: value
        }
      }
    }})
  }
  const onDeleteEvent = () => {
    metafieldDelete({variables: {
      input: {
        id: node.id
      }
    }})
    onDelete(node.id)
  }
  const onMetafieldCreate = () => {
    customerUpdate({variables: {
      input: {
        id: customerId,
        metafields: {
          key: key,
          valueType: 'STRING',
          namespace: 'global',
          value: value
        }
      }
    }})
  }
  return (
    <List.Item>
      <div className={styles.metafieldItem}>
        <TextField 
          value={key}
          onChange={onSetKey}
          autoComplete="off"
          label="Metafield name"
        />
        <TextField 
          value={value}
          onChange={onSetValue}
          autoComplete="off"
          multiline={true}
          label="Metafield value"
        />
      </div>
      <span className={styles.btn}><Button onClick={onCustomerUpdate}>Update</Button></span>
      <span className={styles.btn}><Button destructive onClick={onDeleteEvent}>Delete</Button></span>
      <span className={styles.btn}><Button primary onClick={onMetafieldCreate}>Save</Button></span>
    </List.Item>
  )
}

export default Metafield
