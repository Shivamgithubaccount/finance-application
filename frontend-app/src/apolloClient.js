import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
    );
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

const authLink = setContext(() => {
  const token = localStorage.getItem('token'); 
  console.log ("Token from localSt",localStorage.getItem('token'))
  return {
    headers: {
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});
const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql',
});
const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});

export default client;
