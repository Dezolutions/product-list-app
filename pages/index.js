import { useQuery } from "@apollo/client";
import { Heading, Layout, Page, Card, ResourceList, Avatar, TextStyle, TextField, Button, DisplayText } from "@shopify/polaris";
import Customer from "../components/Customer/Customer";
import { GET_CUSTOMERS } from "../graphql/mutations";

const Index = () => {
  const [customers, setCustomers] = React.useState(null)
  const [input, setInput] = React.useState('')
  const [selected, setSelected] = React.useState(null)
  const { data } = useQuery(GET_CUSTOMERS)

  React.useEffect(() => {
    setCustomers(data?.customers.edges)
  },[data])
  const onSelect = (customer) => {
    setSelected(customer)
  }
  const onBack = () => {
    setSelected(null)
  }
  const onInput = React.useCallback((newValue) => {
    setInput(newValue)
    setCustomers(data.customers.edges.filter((customer) => {
      return customer.node.email?.includes(newValue)
      || customer.node.firstName?.includes(newValue)
      || customer.node.lastName?.includes(newValue)
    }))
  }, [customers,data]);
  return (
    <Page>
      <Layout>
        <Layout.Section>
          <Card sectioned>
            {!selected &&
              <TextField
                value={input}
                onChange={onInput}
                placeholder="Find customer by Name, Lastname or email"
                autoComplete="off"
              />}
            {customers && !selected &&
            <ResourceList
              hasMoreItems={true}
              resourceName={{singular: 'customer', plural: 'customers'}}
              items={customers}
              renderItem={(item) => {
                const {id, firstName, lastName, email} = item.node;
                const name = `${firstName} ${lastName}`
                const media = <Avatar customer size="medium" name={name} />;
              
                return (
                  <ResourceList.Item
                    id={id}
                    media={media}
                    accessibilityLabel={`View details for ${name}`}
                    onClick={() => onSelect(item.node)}
                  >
                    <h3>
                      <TextStyle variation="strong">{name}</TextStyle>
                    </h3>
                    <p>{email}</p>
                  </ResourceList.Item>
                );
              }}
            />}
            {selected && <Customer {...selected} onBack={onBack} />}
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default Index;
