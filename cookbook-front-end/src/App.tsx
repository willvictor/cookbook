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
    mutation Login($googleTokenId: String!,$firstName: String!,$lastName: String!,$email: String!,$imageUrl: String!){
        login(googleTokenId:$googleTokenId,firstName:$firstName,lastName:$lastName,email:$email,imageUrl:$imageUrl){
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


const App = () => {
  const classes = useStyles();
  const [loginToastOpen, setLoginToastOpen] = useState(false);
  const {data, client} = useQuery(GET_STATE);
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
          </IconButton>
          {!data.userIsLoggedIn
          && 
          <GoogleLogin
                onSuccess={(googleUser: any) => login(
                  {
                    variables: {
                      googleTokenId: googleUser.getAuthResponse().id_token,
                      firstName: googleUser.profileObj.givenName,
                      lastName: googleUser.profileObj.familyName,
                      email: googleUser.profileObj.email,
                      imageUrl: googleUser.profileObj.imageUrl
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
      {data.currentPanel === Panels.createRecipe && <CreateRecipe/>}

      <Snackbar open={loginToastOpen} autoHideDuration={3000} onClose={() => setLoginToastOpen(false)}>
        <Alert onClose={() => setLoginToastOpen(false)} severity="success">
          Welcome {loginData && loginData.login.firstName} {loginData && loginData.login.lastName}!
        </Alert>
      </Snackbar>
    </Container>
    </>;
}

export default App;
