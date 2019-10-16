import { WebSocketLink } from 'apollo-link-ws';
import { ApolloClient, InMemoryCache, HttpLink } from 'apollo-boost';
import { getMainDefinition } from 'apollo-utilities';
import { split } from 'apollo-link';

const httpLink = new HttpLink({
  uri: 'ws://localhost:8080/v1/graphql',
});

const wsLink = new WebSocketLink({
  uri: 'ws://localhost:8080/v1/graphql',
  options: {
    reconnect: true,
  },
});

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return (
      kind === 'OperationDefinition'
      && operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

// Client
export default new ApolloClient({
  link,
  cache: new InMemoryCache(),
});
