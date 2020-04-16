import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Container, AppBar, Typography, Toolbar, IconButton} from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import AddIcon from '@material-ui/icons/Add';
import Recipes from './Components/Recipes';
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import RecipeDetail from './Components/RecipeDetail';
import CreateRecipe from './Components/CreateRecipe';

export enum Panels {
  browseRecipes = 1,
  recipeDetail = 2,
  createRecipe = 3,
}

const GET_VISIBLE_PANEL = gql`
  {
    currentPanel @client,
    recipeDetailId @client
  }
`;

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
  const { data, client } = useQuery(GET_VISIBLE_PANEL);
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
        </Toolbar>
      </AppBar>
      {data.currentPanel === Panels.browseRecipes && <Recipes/>}
      {data.currentPanel === Panels.recipeDetail && <RecipeDetail recipeDetailId={data.recipeDetailId}/>}
      {data.currentPanel === Panels.createRecipe && <CreateRecipe/>}
    </Container>
    </>;
}

export default App;
