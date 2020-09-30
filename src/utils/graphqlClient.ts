import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import fetch from 'cross-fetch';
import config from './config';

let _authToken: string | undefined;

export function setAuthToken(token = '') {
  _authToken = token;
  const httpLink = new HttpLink({
    fetch,
    uri: `${config.signalApi}/`,
  });

  const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = _authToken;
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `${token}` : '',
      },
    };
  });

  _client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            getAttendeeCalendar: {
              merge(existing, incoming) {
                // always take the database as source of truth
                return [...incoming];
              },
            },
          },
        },
      },
    }),
  });
}

let _client: ApolloClient<NormalizedCacheObject>;
// creating a default client;
setAuthToken();

export function client() {
  return _client;
}
