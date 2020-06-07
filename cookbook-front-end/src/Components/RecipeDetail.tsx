import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Grid, Paper, CircularProgress, CardMedia, Typography} from '@material-ui/core';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Error from './Error';
import { useParams } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        textAlign: "center"
    },
    media: {
        width: "100%",
        height: 300
    },
    header: {
        display: "flex",
        justifyContent: "center",
        flexDirection: "column"
    },
    title: {
        alignSelf: "flex-start"
    },
    subtitle: {
        alignSelf: "flex-end"
    },
    preformatted: {
        whiteSpace: "pre-wrap"
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

const RecipeDetail = () => {
    let { recipeDetailId } = useParams();
    recipeDetailId = parseInt(recipeDetailId);

    const classes = useStyles();
    const { loading, error, data } = useQuery(GET_RECIPES, {variables: {recipeDetailId: recipeDetailId}});
    
    if (loading) {
      return <CircularProgress/>;
    }

    if (error) {
      return <Error errorMessage={error.message} />;
    }
    
    return   <Paper className={classes.root}>
        <Grid container spacing={3}>
            <Grid item xs={12}>
                {data.recipe.imageUrl
                ? <CardMedia
                    image={data.recipe.imageUrl}
                    title={data.recipe.name}
                    className={classes.media}/>
                : ""}
            </Grid>
            <Grid item xs={12} className={classes.header}>
                    <Grid item>
                        <Typography variant="h4" className={classes.title}>{data.recipe.name}</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="subtitle1" className={classes.subtitle}>Created by {data.recipe.creator.firstName} {data.recipe.creator.lastName}</Typography>
                    </Grid>
            </Grid>
            <Grid item xs={6}>
                <Typography variant="h5">Ingredients</Typography>
                <Typography variant="body1" className={classes.preformatted}>{data.recipe.ingredients}</Typography>
            </Grid>

            <Grid item xs={6}>
                <Typography variant="h5">Directions</Typography>
                <Typography variant="body1" className={classes.preformatted}>{data.recipe.directions}</Typography>
            </Grid>
            
        </Grid>
    </Paper>;
}

export default RecipeDetail;
