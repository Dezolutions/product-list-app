import React from 'react'
import {  ResourceList, Avatar, TextStyle } from "@shopify/polaris";

const CustomerList = ({customers, onSelect}) => {
  return (
    <ResourceList
      hasMoreItems={true}
      resourceName={{ singular: 'customer', plural: 'customers' }}
      items={customers}
      renderItem={(item) => {
        const { id, firstName, lastName, email } = item;
        const name = `${firstName} ${lastName}`
        const media = <Avatar customer size="medium" name={name} />;
        return (
          <ResourceList.Item
            id={id}
            media={media}
            accessibilityLabel={`View details for ${name}`}
            onClick={() => onSelect(item)}
          >
            <h3>
              <TextStyle variation="strong">{name}</TextStyle>
            </h3>
            <p>{email}</p>
          </ResourceList.Item>
        );
      }}
    />
  )
}

export default CustomerList
