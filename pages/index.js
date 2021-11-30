import { useQuery } from "@apollo/client";
import { Heading, Layout, Page, Card } from "@shopify/polaris";
import { GET_CUSTOMERS } from "../graphql/mutations";

const Index = () => {

  const {data} = useQuery(GET_CUSTOMERS)
  
  return (
    <Page>
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Heading>Customer metafields</Heading>

          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default Index;
