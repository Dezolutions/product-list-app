import { Heading, Layout, Page, Card } from "@shopify/polaris";

const Index = () => {

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
