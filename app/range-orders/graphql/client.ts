import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://lp-service.chainflip.io/graphql',
  cache: new InMemoryCache(),
});

export default client;
