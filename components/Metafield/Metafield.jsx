import React from 'react'
import { Button, TextField, List, Modal, TextContainer } from '@shopify/polaris'
import styles from './metafield.module.css'
import { useMutation } from '@apollo/client'
import { ADD_METAFIELD, DELETE_METAFIELDS } from '../../graphql/mutations'
import { GET_CUSTOMER_METAFIELDS } from "../../graphql/queries";

const Metafield = ({node, customerId, onDelete, id}) => {
  //states
  const [active, setActive] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);
  const [keyDisabled, setKeyDisabled] = React.useState(false);
  const [key, setKey] = React.useState('')
  const [value, setValue] = React.useState('')

  //handlers
  const onSetKey = React.useCallback((newValue) => {
    newValue.length > 0 ? setDisabled(false) : setDisabled(true)
    setKey(newValue)
  }, []);

  const onSetValue = React.useCallback((newValue) => setValue(newValue), []);
  const handleChange = React.useCallback(() => setActive(!active), [active]);

  React.useEffect(() => {
    setValue(node.value)
    setKey(node.key)
    !node.id && setDisabled(true)
    node.key && setKeyDisabled(true)
  },[node])

  //mutations
  const [updateMetafield,{loading:updateLoading}] = useMutation(ADD_METAFIELD,{refetchQueries:[
    {query: GET_CUSTOMER_METAFIELDS, variables: {id: customerId}}
  ]})
  const [createMetafield,{loading:addLoading}] = useMutation(ADD_METAFIELD,{refetchQueries:[
    {query: GET_CUSTOMER_METAFIELDS, variables: {id: customerId}}
  ]})
  const [metafieldDelete] = useMutation(DELETE_METAFIELDS,{refetchQueries:[
    {query: GET_CUSTOMER_METAFIELDS, variables: {id: customerId}}
  ]})

  //functions
  const onCustomerUpdate = () => {
    updateMetafield({variables: {
      input: {
        id: customerId,
        metafields: {
          id: node?.id,
          valueType: 'STRING',
          namespace: 'bulk_order_forms',
          value: value
        }
      }
    }})
  }
  const onDeleteEvent = () => {
    node.id && metafieldDelete({variables: {
      input: {
        id: node.id
      }
    }})
    onDelete(id)
    setActive(false)
  }
  const onMetafieldCreate = () => {
    createMetafield({variables: {
      input: {
        id: customerId,
        metafields: {
          key: key,
          valueType: 'STRING',
          namespace: 'bulk_order_forms',
          value: value
        }
      }
    }})
  }

  const activator = <div className={styles.activator}><Button destructive onClick={handleChange}>Delete</Button></div>
  
  return (
    <List.Item>
      <div className={styles.metafieldItem}>
        <TextField 
          value={key}
          onChange={onSetKey}
          disabled={keyDisabled}
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
      <div className={styles.btnBlock}>
        <div>
          <span className={styles.btn}><Button disabled={disabled} loading={updateLoading} onClick={onCustomerUpdate}>Update</Button></span>
          <span className={styles.btn}><Button disabled={disabled} loading={addLoading} primary onClick={onMetafieldCreate}>Save</Button></span>
        </div>
        <Modal
          activator={activator}
          open={active}
          onClose={handleChange}
          title="Are you sure you want to delete?"
          primaryAction={{
            destructive: true,
            content: 'Delete',
            onAction: onDeleteEvent,
          }}
        >
          <Modal.Section>
            <TextContainer>
              <p>
                Deleting this metafield means removing order form with specially products.
                If you want to change list of products, you can configure metafield value and click 'Update'.
              </p>
            </TextContainer>
          </Modal.Section>
        </Modal>
      </div>
    </List.Item>
  )
}

export default Metafield
