import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import { InMemoryCache } from "apollo-cache-inmemory";

export interface InMemoryCacheWithNullSafeReadQuery extends InMemoryCache {
  originalReadQuery: any;
}

let cache = new InMemoryCache() as InMemoryCacheWithNullSafeReadQuery;

// TODO: Monkey-patching in a fix for an open issue suggesting that
// `readQuery` should return null or undefined if the query is not yet in the
// cache: https://github.com/apollographql/apollo-feature-requests/issues/
// code copied from here: https://github.com/apollographql/apollo-feature-requests/issues/1#issuecomment-431842138
cache.originalReadQuery = cache.readQuery;
cache.readQuery = (...args) => {
  try {
    return cache.originalReadQuery(...args);
  } catch (err) {
    return undefined;
  }
};

const client = new ApolloClient({
  uri: "/graphql",
  cache: cache,
  resolvers: {}
});

const data = {
  deletedRecipeToastIsOpen: false
};
cache.writeData({ data });

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
