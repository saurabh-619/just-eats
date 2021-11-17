import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  split,
} from "@apollo/client";
import {
  BASE_API_URL,
  PROD_BASE_API_URL,
  PROD_WS_BASE_API_URL,
  TOKEN_KEY,
  WS_BASE_API_URL,
} from "../utils/constants";
import { setContext } from "@apollo/client/link/context";
import { store } from "../redux/store";
import { getLocalStorage } from "../utils/helpers";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";

export const getClient = (token: string) => {
  const wsLink = new WebSocketLink({
    uri:
      process.env.NODE_ENV === "development"
        ? `${WS_BASE_API_URL}/graphql`
        : PROD_WS_BASE_API_URL,
    options: {
      reconnect: true,
      connectionParams: {
        "X-JWT":
          store.getState().token.value || getLocalStorage(TOKEN_KEY) || "",
      },
    },
  });

  const httpLink = createHttpLink({
    uri:
      process.env.NODE_ENV === "development"
        ? `${BASE_API_URL}/graphql`
        : PROD_BASE_API_URL,
  });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        "X-JWT":
          store.getState().token.value || getLocalStorage(TOKEN_KEY) || "",
      },
    };
  });

  const splitLink = split(
    ({ query }) => {
      const defination = getMainDefinition(query);
      return (
        defination.kind === "OperationDefinition" &&
        defination.operation === "subscription"
      );
    },
    wsLink,
    authLink.concat(httpLink)
  );
  return new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
  });
};
