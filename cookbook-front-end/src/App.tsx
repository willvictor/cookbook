import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  Container,
  AppBar,
  Typography,
  Toolbar,
  IconButton,
  Button,
  Snackbar
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import HomeIcon from "@material-ui/icons/Home";
import Recipes from "./Components/Recipes";
import { useQuery, useMutation } from "@apollo/react-hooks";
import RecipeDetail from "./Components/RecipeDetail";
import CreateRecipe from "./Components/CreateRecipe";
import { GoogleLogin } from "react-google-login";
import { LOGIN } from "./GraphqlQueries/LoginQuery";
import { GET_APP_STATE } from "./GraphqlQueries/AppStateQuery";
import { AppState } from "./GraphqlQueryTypes/AppStateType";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import { InMemoryCache } from "apollo-cache-inmemory";

const useStyles = makeStyles({
  root: {
    flexGrow: 1
  },
  menuButton: {},
  title: {
    flexGrow: 1
  },
  addButton: {},
  routerLink: {
    textDecoration: "none",
    color: "inherit"
  }
});

export interface InMemoryCacheWithNullSafeReadQuery extends InMemoryCache {
  originalReadQuery: any;
}

const AppApolloWrapper = () => {
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
  return (
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  );
};

const App = () => {
  const classes = useStyles();
  const [loginToastOpen, setLoginToastOpen] = useState(false);
  const { data: appState, client: apolloClient } = useQuery<AppState>(
    GET_APP_STATE
  );

  const [login, { data: loginData }] = useMutation(LOGIN, {
    update: (cache, mutationResult) => {
      const appStateToUpdate = cache.readQuery<AppState>({
        query: GET_APP_STATE
      });

      if (appStateToUpdate !== null) {
        cache.writeQuery({
          query: GET_APP_STATE,
          data: {
            ...appStateToUpdate,
            sessionUser: mutationResult.data.login,
            googleClientId: appStateToUpdate.googleClientId
          }
        });
        setLoginToastOpen(true);
      }
    }
  });

  return (
    <Router>
      <Container maxWidth="lg">
        <AppBar position="static" className={classes.root}>
          <Toolbar>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="home"
            >
              <Link to="/" className={classes.routerLink}>
                <HomeIcon data-testid="home-button" />
              </Link>
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Cookbook
            </Typography>
            {!!appState && !!appState.sessionUser && (
              <IconButton
                edge="start"
                className={classes.addButton}
                color="inherit"
                aria-label="add"
              >
                <Link to="/create" className={classes.routerLink}>
                  <Typography variant="button">Add recipe</Typography>
                </Link>
              </IconButton>
            )}
            {!!appState && !appState.sessionUser && (
              <GoogleLogin
                onSuccess={(googleUser: any) =>
                  login({
                    variables: {
                      googleTokenId: googleUser.getAuthResponse().id_token
                    }
                  })
                }
                onFailure={() => console.log("failed to login google user")}
                clientId={appState.googleClientId}
                render={renderProps => (
                  <Button
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                    color="inherit"
                  >
                    <Typography variant="button">Login</Typography>
                  </Button>
                )}
                cookiePolicy={"single_host_origin"}
              />
            )}
          </Toolbar>
        </AppBar>

        <Switch>
          <Route exact path="/recipes">
            <Recipes />
          </Route>
          <Route exact path="/">
            <Recipes />
          </Route>
          <Route path="/recipes/:recipeId">
            <RecipeDetail />
          </Route>
          {/* #20 Need to AUTH protect this endpoint */}
          <Route path="/create">
            <CreateRecipe />
          </Route>
        </Switch>

        <Snackbar
          open={loginToastOpen}
          autoHideDuration={3000}
          onClose={() => setLoginToastOpen(false)}
        >
          <Alert onClose={() => setLoginToastOpen(false)} severity="success">
            Welcome {loginData && loginData.login.firstName}{" "}
            {loginData && loginData.login.lastName}!
          </Alert>
        </Snackbar>

        {appState && (
          <Snackbar
            open={appState.deletedRecipeToastIsOpen}
            autoHideDuration={3000}
            onClose={() =>
              apolloClient.writeData({
                data: { deletedRecipeToastIsOpen: false }
              })
            }
          >
            <Alert
              onClose={() =>
                apolloClient.writeData({
                  data: { deletedRecipeToastIsOpen: false }
                })
              }
              severity="success"
            >
              Successfully deleted recipe
            </Alert>
          </Snackbar>
        )}
      </Container>
    </Router>
  );
};

export default AppApolloWrapper;
