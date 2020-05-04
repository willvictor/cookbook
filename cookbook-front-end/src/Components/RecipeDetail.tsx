import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Grid, Paper, CircularProgress, CardMedia, Typography} from '@material-ui/core';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Error from './Error';

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2)
    },
    media: {
        height: 400,
        width: 400,
        borderRadius: 10
    }
}));
const GET_RECIPES = gql`
query Recipe($recipeDetailId: Int){
    recipe(recipeId:$recipeDetailId) {
        recipeId,
        name,
        ingredients,
        directions,
        imageUrl,
        creator {
            firstName,
            lastName
        }
    }
}`;


export interface Props {
    recipeDetailId: number
}

const RecipeDetail = (props: Props) => {
    const classes = useStyles();
    const { loading, error, data } = useQuery(GET_RECIPES, {variables: {recipeDetailId: props.recipeDetailId}});
    
    if (loading) {
      return <CircularProgress/>;
    }

    if (error) {
      return <Error errorMessage={error.message} />;
    }
    
    return   <Paper className={classes.root}>
        <Grid container spacing={3}>
            <Grid item xs={6}>
                <Grid container spacing={3}>
                    <Grid item>
                        <Typography variant="h3">{data.recipe.name}</Typography>
                        <Typography variant="subtitle1">Created by {data.recipe.creator.firstName} {data.recipe.creator.lastName}</Typography>
                    </Grid>
                    
                    <Grid item>
                        <Typography variant="h5">Ingredients</Typography>
                        <Typography variant="body1">{data.recipe.ingredients}</Typography>
                    </Grid>

                    <Grid item>
                        <Typography variant="h5">Directions</Typography>
                        <Typography variant="body1">{data.recipe.directions}</Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={6}>
                <CardMedia
                    className={classes.media}
                    image={data.recipe.imageUrl}
                    title={data.recipe.name}
                />
            </Grid>
        </Grid>
    </Paper>;
}

export default RecipeDetail;
