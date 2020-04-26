import React, {useState} from 'react';
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

export enum Panels {
  browseRecipes = 1,
  recipeDetail = 2,
  createRecipe = 3,
}

const GET_STATE = gql`
  {
    currentPanel @client,
    recipeDetailId @client,
    userIsLoggedIn @client
  }
`;

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

  }
});

const updateUrl = (state: any) => {
  const params = 
    state.currentPanel === Panels.recipeDetail && state.recipeDetailId
    ? `?recipeDetailId=${state.recipeDetailId}`
    : "";
  window.history.pushState({}, "", `/${Panels[state.currentPanel]}${params}`);
}

const App = () => {
  const classes = useStyles();
  const [loginToastOpen, setLoginToastOpen] = useState(false);
  const {data, client} = useQuery(GET_STATE);
  if (data){
    updateUrl(data);
  }
  const [login, { data : loginData, loading : loginLoading}] = useMutation(
    LOGIN, 
    {
      update: (cache, mutationResult) => {
        cache.writeData({
            data: {
                userIsLoggedIn: true
            }
        });
        setLoginToastOpen(true);
      }
    });
  return <>
    <Container maxWidth="md">
      <AppBar position="static" className={classes.root}>
        <Toolbar>
          <IconButton 
            edge="start" 
            className={classes.menuButton} 
            color="inherit" 
            aria-label="home" 
            onClick={() => client.writeData({
              data: {
                currentPanel: Panels.browseRecipes
              }
            })}>
            <HomeIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Cookbook
          </Typography>
          {data.userIsLoggedIn
            && 
            <IconButton 
              edge="start" 
              className={classes.addButton} 
              color="inherit" 
              aria-label="add"
              onClick={() => client.writeData({
                data: {
                  currentPanel: Panels.createRecipe
                }
              })}>
              <AddIcon />
            </IconButton>}
          {!data.userIsLoggedIn
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
                clientId = "984941479252-maabsnngi084tun89leu7ts4otp1jldo.apps.googleusercontent.com"
                render={renderProps => (
                  <Button onClick={renderProps.onClick} disabled={renderProps.disabled} color="inherit">Login</Button>
                )}
                cookiePolicy={'single_host_origin'}/>
          }
        </Toolbar>
      </AppBar>
      {data.currentPanel === Panels.browseRecipes && <Recipes/>}
      {data.currentPanel === Panels.recipeDetail && <RecipeDetail recipeDetailId={data.recipeDetailId}/>}
      {data.currentPanel === Panels.createRecipe && data.userIsLoggedIn && <CreateRecipe/>}

      <Snackbar open={loginToastOpen} autoHideDuration={3000} onClose={() => setLoginToastOpen(false)}>
        <Alert onClose={() => setLoginToastOpen(false)} severity="success">
          Welcome {loginData && loginData.login.firstName} {loginData && loginData.login.lastName}!
        </Alert>
      </Snackbar>
    </Container>
    </>;
}

export default App;
