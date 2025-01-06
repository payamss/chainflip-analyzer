import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://explorer-service-processor.chainflip.io/graphql',
  cache: new InMemoryCache(),
});

export default client;
