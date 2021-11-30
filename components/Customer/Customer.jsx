import React from 'react'
import {TextStyle, Button, List } from '@shopify/polaris'
import styles from './customer.module.css'
import Metafield from '../Metafield/Metafield'

const Customer = ({firstName, metafields, onBack, id, lastName}) => {

  const [fields, setFields] = React.useState([])
  

  React.useEffect(() => {
    setFields(metafields.edges)
  },[metafields])

  const onAdd = () => {
    setFields(prev => [...prev,{node: {key:'', value: ''}}])
  }
  const onDelete = (id) => {
    setFields(prev => prev.filter(field => field.node.id == id))
  }
  return (
    <div>
      <div className={styles.metafieldList}>
        <p><TextStyle variation="strong">Customer: </TextStyle>{firstName} {lastName}</p>
        <List type="number">
          {fields.map(metafield => <Metafield key={metafield.node.id} onDelete={onDelete} customerId={id} {...metafield}/>)}
        </List>
        
      </div>
      <span className={styles.btn}><Button onClick={onAdd} primary>Add metafield</Button></span>
      <span className={styles.btn}><Button onClick={onBack} >Back to customers</Button></span>
    </div>
  )
}

export default Customer
