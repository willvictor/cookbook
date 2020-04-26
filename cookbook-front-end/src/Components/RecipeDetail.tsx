import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Grid, Paper, CircularProgress} from '@material-ui/core';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      marginTop: theme.spacing(2)
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
    },
}));
const GET_RECIPES = gql`
query Recipe($recipeDetailId: Int){
    recipe(recipeId:$recipeDetailId) {
        recipeId,
        name,
        ingredients,
        directions
    }
}`;


export interface Props {
    recipeDetailId: number
}

const RecipeDetail = (props: Props) => {
    const classes = useStyles();
    const { loading, error, data } = useQuery(GET_RECIPES, {variables: {recipeDetailId: props.recipeDetailId}});
    if(loading) return <CircularProgress/>;
    if(error) return <span>Oh No! An Error Occurred</span>;
    return  <div className={classes.root}>
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Paper className={classes.paper}>
                    <h1>{data.recipe.name}</h1>
                </Paper>
            </Grid>
            <Grid item xs={6}>
                <Paper className={classes.paper}>
                    <h4>Ingredients</h4>
                    <p>{data.recipe.ingredients}</p>
                </Paper>
            </Grid>
            <Grid item xs={6}>
                <Paper className={classes.paper}>
                    <h4>Directions</h4>
                    <p>{data.recipe.directions}</p>
                </Paper>
            </Grid>
        </Grid>
    </div>;
}

export default RecipeDetail;
