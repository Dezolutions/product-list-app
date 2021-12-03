import React from 'react'
import {TextStyle, Button, List, Loading, Frame } from '@shopify/polaris'
import styles from './customer.module.css'
import Metafield from '../Metafield/Metafield'
import {nanoid} from 'nanoid'
import { useQuery } from '@apollo/client'
import { GET_CUSTOMER_METAFIELDS } from '../../graphql/queries'

const Customer = ({firstName, onBack, id, lastName}) => {

  const [fields, setFields] = React.useState([])

  const { data, loading } = useQuery(GET_CUSTOMER_METAFIELDS,{variables:{id:id}})
  
  React.useEffect(() => {
    setFields(data?.customer.metafields.edges.map(item => ({...item, id: nanoid()})))
  },[data])

  const onAdd = () => {
    setFields(prev => [...prev,{node: {key:'', value: ''}, id: nanoid()}])
  }
  const onDelete = (id) => {
    setFields(prev => prev.filter(field => field.id != id))
  }
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
        <p><TextStyle variation="strong">Customer: </TextStyle>{firstName} {lastName}</p>
        <div className={styles.metafieldList}>
          
          <List type="number">
            {fields?.map(metafield => <Metafield key={metafield.id} onDelete={onDelete} customerId={id} {...metafield}/>)}
          </List>
          
        </div>
        <span className={styles.btn}><Button onClick={onAdd} primary>Add metafield</Button></span>
        <span className={styles.btn}><Button onClick={onBack} >Back to customers</Button></span>
      </div>
    </>
  )
}

export default Customer
