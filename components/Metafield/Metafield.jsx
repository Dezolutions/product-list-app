import React from 'react'
import { Button, TextField, List, Modal, TextContainer, Badge, InlineError } from '@shopify/polaris'
import styles from './metafield.module.css'
import {DebounceInput} from 'react-debounce-input'
import TextareaAutosize from 'react-textarea-autosize'
import { useMutation, useQuery } from '@apollo/client'
import { ADD_METAFIELD, DELETE_METAFIELDS, UPDATE_METAFIELD } from '../../graphql/mutations'
import { GET_CUSTOMER_METAFIELDS, GET_PRODUCT_BY_SKU } from "../../graphql/queries";

const Metafield = ({node, customerId, onDelete, id}) => {

  //states
  const [active, setActive] = React.useState(false);
  const [keyDisabled, setKeyDisabled] = React.useState(false);
  const [key, setKey] = React.useState('')
  const [value, setValue] = React.useState('')
  const [badgeValue, setBadgeValue] = React.useState('')
  const [badgeStatus, setBadgeStatus] = React.useState('')
  const [btnDisabled, setBtnDisabled] = React.useState(false)
  const [btnLoading, setBtnLoading] = React.useState(false)
  const [skuError, setSkuError] = React.useState(false)
  const [skip, setSkip] = React.useState(false)
  const [skus, setSkus] = React.useState([])

  //queries and mutations
  const {data: data3} =useQuery(GET_PRODUCT_BY_SKU,{
    variables:{
      count: value.split(',').length, 
      sku: value.split(',').map(val => val = `sku:${val}`).join(' ').replace(/ /g, ' OR ') 
    },
    fetchPolicy: 'network-only',
    skip: skip,
    onCompleted: (data) => {
      setSkip(true)
      setBtnLoading(false)
      const skuArray = data?.productVariants.edges.map(variant => variant.node.sku)
      
      value.split(',').map((sku) => {
        !skuArray?.includes(sku) && sku != '' && setSkus(prev => [...prev,sku])
      })
      if (value && value.split(',').length === data?.productVariants.edges.length) {
        setSkuError(false)
        setBtnDisabled(false)
      }
      else if (value && (value.split(',').length != data?.productVariants.edges.length)) {
        setSkuError(true)
        setBtnDisabled(true)
      }

      if (!/^[a-zA-Z0-9,]+$/.test(value)) {
        setSkuError(true)
        setBtnDisabled(true)
      }
    }
  })
  console.log(data3)
  const [updateMetafield,{loading:updateLoading}] = useMutation(UPDATE_METAFIELD,{
    refetchQueries:[
      {
        query: GET_CUSTOMER_METAFIELDS, 
        variables: {
          id: customerId
        }
      }
    ],
    onCompleted: () => {
      setBadgeValue('Metafield updated')
      setBadgeStatus('attention')
    }
  })

  const [createMetafield,{loading:addLoading}] = useMutation(ADD_METAFIELD,{
    refetchQueries:[
    {
      query: GET_CUSTOMER_METAFIELDS, 
      variables: {
        id: customerId
      }
    }],
    onCompleted: () => {
      setBadgeValue('Metafield created')
      setBadgeStatus('success')
    }
  })

  const [metafieldDelete] = useMutation(DELETE_METAFIELDS)

  //handlers
  const onSetKey = React.useCallback((newValue) => {
    setKey(newValue)
  }, []);

  const onSetValue = React.useCallback((e) => {
    setValue(e.target.value)
    setSkip(false)
  }, []);
  const onInput = () => {
    setBtnLoading(true)
    setSkus([])
    setSkuError(false)
  }
  const handleChange = React.useCallback(() => setActive(!active), [active]);

  //useEffects
  React.useEffect(() => {
    setSkip(true)
  },[])

  React.useEffect(() => {
    setValue(node.value)
    setKey(node.key)
    node.key && setKeyDisabled(true)
  },[node])

  //functions
  const onCustomerUpdate = () => {
    if (value && value != node.value){
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
    else if (value != '' && value == node.value) {
      setBadgeValue('Nothing to update')
      setBadgeStatus('info')
    }
    else {
      setBadgeValue('value is empty')
      setBadgeStatus('critical')
    }
    
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
    if(value && key && key != node.key){
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
    else if (key != '' && key == node.key) {
      setBadgeValue('Metafield already created')
      setBadgeStatus('info')
    }
    else {
      setBadgeValue('key or value is empty')
      setBadgeStatus('critical')
    }
    
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
          label="Metafield key"
        />
        <div>
          <div><label>Metafield value</label></div>
          <DebounceInput
            element={TextareaAutosize}
            className={styles.debounceInput}
            onInput={onInput}
            value={value}
            onChange={onSetValue}
            debounceTimeout={1000}
          />
        </div>
      </div>
      {skuError && <InlineError message={skus.length ? `These SKUs doesn't exist:${skus.join(',')}` : "Something went wrong(invalid symbol or extra comma)"} fieldID="myFieldID" />}
      <div className={styles.btnBlock}>
        <div>
          <span className={styles.btn}><Button loading={btnLoading || updateLoading} disabled={btnDisabled} onClick={onCustomerUpdate}>Update</Button></span>
          {!node.key && <span className={styles.btn}><Button loading={btnLoading || addLoading} primary disabled={btnDisabled} onClick={onMetafieldCreate}>Save</Button></span>}
          {badgeValue && <Badge status={badgeStatus}>{badgeValue}</Badge>}
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
