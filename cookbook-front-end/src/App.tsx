import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Container, AppBar, Typography, Toolbar, IconButton} from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import Recipes from './Components/Recipes';
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import RecipeDetail from './Components/RecipeDetail'

export enum Panels {
  browseRecipes = 1,
  recipeDetail = 2
}

const GET_VISIBLE_PANEL = gql`
  {
    currentPanel @client,
    recipeDetailId @client
  }
`;

const useStyles = makeStyles({
  menuButton: {
  },
  title: {
  }
});


const App = () => {
  const classes = useStyles();
  const { data, client } = useQuery(GET_VISIBLE_PANEL);
  return <>
    <Container maxWidth="md">
      <AppBar position="static">
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
        </Toolbar>
      </AppBar>
      {data.currentPanel === Panels.browseRecipes && <Recipes/>}
      {data.currentPanel === Panels.recipeDetail && <RecipeDetail recipeDetailId={data.recipeDetailId}/>}
    </Container>
    </>;
}

export default App;
