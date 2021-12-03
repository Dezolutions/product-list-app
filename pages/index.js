import { useQuery } from "@apollo/client";
import { Layout, Page, Card, TextField, Button, Frame, Loading } from "@shopify/polaris";
import Customer from "../components/Customer/Customer";
import CustomerList from "../components/CustomerList/CustomerList";
import { GET_CUSTOMER, GET_CUSTOMERS } from "../graphql/queries";

const Index = () => {

  //states
  const [customers, setCustomers] = React.useState([])
  const [filteredCustomer, setFilteredCustomer] = React.useState(null)
  const [email, setEmail] = React.useState('')
  const [selected, setSelected] = React.useState(null)
  const [hasMore, setHasMore] = React.useState(null)
  const [skip, setSkip] = React.useState(false)

  //queries
  const { data, fetchMore, loading } = useQuery(GET_CUSTOMERS,{notifyOnNetworkStatusChange:true})
  const { data: customerData, loading: searchLoading } = useQuery(GET_CUSTOMER, {
    variables: {email: email}, 
    skip: skip, 
    onCompleted:() => {
      setSkip(true)
    }
  })

  //handlers
  const onSearch = () => setSkip(false)
  const onClear = () => {
    setEmail('')
    setFilteredCustomer(null)
  }
  const onSelect = (customer) => setSelected(customer)
  const onBack = () => {
    setSelected(null)
    setFilteredCustomer(null)
    setEmail('')
  }
  const onInput = React.useCallback((newValue) => {
    setEmail(newValue)
  }, [customers, data]);

  //use effects
  React.useEffect(() => {
    customerData && email && setFilteredCustomer(customerData?.customers.edges.map(customer => customer.node))
  },[customerData])

  React.useEffect(() => {
    setSkip(true)
  },[])

  React.useEffect(() => {
    setCustomers(data?.customers.edges.map(customer => customer.node))
    setHasMore(data?.customers.pageInfo.hasNextPage)
  }, [data])

  React.useEffect(() => {
    selected && setSelected(prev => customers?.filter(customer => customer.id == prev.id)[0])
  }, [customers])

  //update query(pagination function)
  const onFetchMore = () => {
    const { cursor } = data?.customers.edges[data?.customers.edges.length - 1]
    fetchMore({
      variables: {
        after: cursor
      },
      updateQuery: (prevResult, { fetchMoreResult }) => {
        setHasMore(fetchMoreResult.customers.pageInfo.hasNextPage)
        fetchMoreResult.customers.edges = [
          ...prevResult.customers.edges,
          ...fetchMoreResult.customers.edges
        ]
        return fetchMoreResult
      }
    })
  }

  return (
    <Page>
      <Layout>
        <Layout.Section>
          {loading &&
            <div style={{ height: '1px' }}>
              <Frame>
                <Loading />
              </Frame>
            </div>
          }
          <Card sectioned>
            {!selected &&
              <div>
                <TextField
                  value={email}
                  onChange={onInput}
                  type="email"
                  placeholder="Find customer by email"
                  autoComplete="email"
                  connectedRight={
                    <div>
                      <Button primary loading={searchLoading} onClick={onSearch} >Search</Button>
                      <Button onClick={onClear} >Clear</Button>
                    </div>
                  }
                />
                
              </div>
            }
            {customers && !selected &&
              <>
                <CustomerList onSelect={onSelect} customers={filteredCustomer || customers} />
                {hasMore && <Button loading={loading} onClick={onFetchMore}>more</Button>}
              </>
            }
            {selected && <Customer {...selected} onBack={onBack} />}
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default Index;
