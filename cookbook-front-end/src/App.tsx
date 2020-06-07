import React, {useState} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import {Container, AppBar, Typography, Toolbar, IconButton, Button, Snackbar} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import HomeIcon from '@material-ui/icons/Home';
import AddIcon from '@material-ui/icons/Add';
import Recipes from './Components/Recipes';
import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import RecipeDetail from './Components/RecipeDetail';
import CreateRecipe from './Components/CreateRecipe';
import {GoogleLogin} from 'react-google-login';


const GET_SESSION_INFO = gql`
  query SessionInfo {
    sessionUser{
      firstName,
      lastName,
      imageUrl
    },
    googleClientId
  }
`

const LOGIN = gql`
    mutation Login($googleTokenId: String!){
        login(googleTokenId:$googleTokenId){
            firstName,
            lastName,
            imageUrl
        }
    }`; 

const useStyles = makeStyles({
  root: {
    flexGrow: 1
  },
  menuButton: {
  },
  title: {
    flexGrow: 1
  },
  addButton: {

  },
  routerLink: {
    textDecoration: "none",
    color: "inherit"
  }
});

const App = () => {
  const classes = useStyles();
  const [loginToastOpen, setLoginToastOpen] = useState(false);
  const {data : sessionInfoData, loading: sessionInfoDataLoading} = useQuery(GET_SESSION_INFO);

  const [login, { data : loginData}] = useMutation(
    LOGIN, 
    {
      update: (cache, mutationResult) => {
        const cacheContents = cache.readQuery({ query: GET_SESSION_INFO }) as any;
        cache.writeQuery({
          query: GET_SESSION_INFO,
          data: { sessionUser: mutationResult.data.login, googleClientId: cacheContents.googleClientId },
        });
        setLoginToastOpen(true);
      }
    });

  return <Router>
    <Container maxWidth="lg">
      <AppBar position="static" className={classes.root}>
        <Toolbar>
          <IconButton 
            edge="start" 
            className={classes.menuButton} 
            color="inherit" 
            aria-label="home">
            <Link to="/" className={classes.routerLink}>
              <HomeIcon />
            </Link>
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Cookbook
          </Typography>
          {!sessionInfoDataLoading
            && !!sessionInfoData.sessionUser
            && 
            <IconButton 
              edge="start" 
              className={classes.addButton} 
              color="inherit" 
              aria-label="add">
              <Link to="/create" className={classes.routerLink}>
                <Typography variant="button">
                  Add recipe
                </Typography>
              </Link>
            </IconButton>}
          { !sessionInfoDataLoading 
          &&
            !sessionInfoData.sessionUser
          && 
          <GoogleLogin
                onSuccess={(googleUser: any) => login(
                  {
                    variables: {
                      googleTokenId: googleUser.getAuthResponse().id_token
                    }
                  })
                }
                onFailure={(response) => console.log("failed to login google user")}
                clientId = {sessionInfoData.googleClientId}
                render={renderProps => (
                  <Button onClick={renderProps.onClick} disabled={renderProps.disabled} color="inherit">
                    <Typography variant="button">
                      Login
                    </Typography>
                    </Button>
                )}
                cookiePolicy={'single_host_origin'}/>
          }
        </Toolbar>
      </AppBar>

      <Switch>
        <Route exact path="/recipes">
          <Recipes />
        </Route>
        <Route exact path="/">
          <Recipes />
        </Route>
        <Route path="/recipes/:recipeDetailId">
          <RecipeDetail />
        </Route>
        {/* #20 Need to AUTH protect this endpoint */}
        <Route path="/create">
          <CreateRecipe />
        </Route>
      </Switch>

      <Snackbar open={loginToastOpen} autoHideDuration={3000} onClose={() => setLoginToastOpen(false)}>
        <Alert onClose={() => setLoginToastOpen(false)} severity="success">
          Welcome {loginData && loginData.login.firstName} {loginData && loginData.login.lastName}!
        </Alert>
      </Snackbar>
    </Container>
  </Router>;
}

export default App;
