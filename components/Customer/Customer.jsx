import React from 'react'
import {TextStyle, Button, List, Loading, Frame, EmptyState, Checkbox, InlineError } from '@shopify/polaris'
import styles from './customer.module.css'
import Metafield from '../Metafield/Metafield'
import {nanoid} from 'nanoid'
import { useQuery,NetworkStatus, useMutation  } from '@apollo/client'
import { GET_CUSTOMER_METAFIELDS } from '../../graphql/queries'
import { ADD_TAG, REMOVE_TAG } from '../../graphql/mutations'

const Customer = ({firstName, onBack, id, lastName}) => {
  //states
  const [fields, setFields] = React.useState([])
  const [checked, setChecked] = React.useState(null)
  const [tags, setTags] = React.useState([])
  const [error, setError] = React.useState(false)

  //queries and mutations
  const { data, loading, refetch,networkStatus  } = useQuery(GET_CUSTOMER_METAFIELDS,{
    variables:{id:id},
    notifyOnNetworkStatusChange: true
  })

  const [tagsAdd] = useMutation(ADD_TAG,{refetchQueries:[
    {
      query: GET_CUSTOMER_METAFIELDS,
      variables: {id: id},
      notifyOnNetworkStatusChange: true  
    }
  ]})

  const [tagsRemove] = useMutation(REMOVE_TAG,{refetchQueries:[
    {
      query: GET_CUSTOMER_METAFIELDS,
      variables: {id: id},
      notifyOnNetworkStatusChange: true  
    }
  ]})

  //handlers
  const handleCheck = () => {
    setChecked(!checked)
    if(!checked) {
      tagsAdd({
        variables: {
          id: id,
          tags: [...tags, 'wholesale']
        }
      })
    }
    else {
      tagsRemove({
        variables: {
          id: id,
          tags: [tags.find(tag => tag === 'wholesale')]
        }
      })
    }
  }

  const onAdd = () => {
    setFields(prev => {
      if (prev.length <= 4) {
        setError(false)
        return [...prev,{node: {key:'', value: ''}, id: nanoid()}]
      } else {
        setError(true)
        return prev
      }
    })
  }
  
  const onDelete = (id) => {
    refetch()
    setFields(prev => prev.filter(field => field.id != id))
    setError(false)
  }

  //useEffects
  React.useEffect(() => {
    setFields(data?.customer.metafields.edges.reduce((acum,item) => {
      if (item.node.namespace == 'bulk_order_forms') {
        return [...acum,{...item, id: nanoid()}]
      }
      return []
    },[]))
    setChecked(data?.customer.tags.includes('wholesale'))
    setTags(data?.customer.tags)
  },[data])
  
  return (
    <>
      {loading &&
        <div style={{ height: '1px' }}>
          <Frame>
            <Loading />
          </Frame>
        </div>
      }
      <div>
        <div className={styles.customerHeader}>
          <p><TextStyle variation="strong">Customer: </TextStyle>{firstName} {lastName}</p>
          <Checkbox
            label="Wholesale status"
            checked={checked}
            onChange={handleCheck}
          />
        </div>
        {data && !fields?.length 
          ? <EmptyState
              heading="Manage your order forms"
              action={{
                content: 'Add metafield',
                onAction: onAdd
              }}
              secondaryAction={{
                content: 'Back to customers',
                onAction: onBack
              }}
              image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
            >
              <p>Create and configure your custom order forms</p>
            </EmptyState>

          : <>
              <div className={styles.metafieldList}>
                <List type="number">
                  {fields?.map(metafield => <Metafield key={metafield.id} onDelete={onDelete} customerId={id} {...metafield}/>)}
                </List>
                {error && <InlineError message="You can't add more than 5 custom forms" fieldID="myFieldID" />}
              </div>
              <span className={styles.btn}><Button disabled={networkStatus === NetworkStatus.refetch ? true : false} onClick={onAdd} primary>Add metafield</Button></span>
              <span className={styles.btn}><Button onClick={onBack} >Back to customers</Button></span>
            </>
        }
      </div>
    </>
  )
}

export default Customer
