import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Container, AppBar, Typography, Button, Toolbar, IconButton} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import Recipes from './Components/Recipes';

const useStyles = makeStyles({
  menuButton: {
  },
  title: {
  }
});


const App = () => {
  const classes = useStyles();
  return <>
    <Container maxWidth="md">
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Cookbook
          </Typography>
        </Toolbar>
      </AppBar>
      <Recipes/>
    </Container>
    </>;
}

export default App;
