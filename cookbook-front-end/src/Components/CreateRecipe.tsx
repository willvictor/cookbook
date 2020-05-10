import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Container, Paper, TextField, CircularProgress, Button} from '@material-ui/core';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';


const useStyles = makeStyles((theme) => ({
    paper: {
        paddingBottom: theme.spacing(2),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2)
    },
    header: {
        textAlign: 'center'
    },
    name: {
        minWidth: "100%"
    },
    ingredients: {
        minWidth: "100%",
    },
    directions: {
        minWidth: "100%",
    },
    imageUrl: {
        minWidth: "100%",
    },
    inputField: {
        marginBottom: theme.spacing(2)
    }
}));

const SUBMIT_RECIPE = gql`
    mutation CreateRecipe($name: String!, $directions: String!, $ingredients: String!, $imageUrl: String){
        createRecipe(name:$name, directions:$directions, ingredients: $ingredients, imageUrl: $imageUrl){
            recipeId
        }
    }`; 

const CreateRecipe = () => {
    const classes = useStyles();
    const [name, setName] = useState(null as any);
    const [ingredients, setIngredients] = useState(null as any);
    const [directions, setDirections] = useState(null as any);
    const [imageUrl, setImageUrl] = useState(null as any);
    const [submitRecipe, {data, loading}] = useMutation(
        SUBMIT_RECIPE, 
        {
            update: (cache, mutationResult) => {
                cache.writeData({
                    data: {
                        recipeDetailId: mutationResult.data.createRecipe.recipeId
                    }
                });
            }
        });

    const isNameError = name === null || name === "";
    const isIngredientsError = ingredients === null || ingredients === "";
    const isDirectionsError = directions === null || directions === "";

    const nameErrorText = isNameError ? "Recipe name can't be null" : null;
    const ingredientsErrorText = isIngredientsError ? "Ingredients can't be null" : null;
    const directionsErrorText = isDirectionsError ? "Directions can't be null" : null;

    return <Container maxWidth="lg">
        {   !loading 
            && !data 
            && <Paper className={classes.paper}>
                <div className={classes.header}>
                    <h1>Create a new recipe</h1>
                </div>
                <div className={classes.inputField}>
                    <TextField 
                    error={isNameError} // Don't want initial state to be error though
                    helperText={nameErrorText}
                    variant="outlined" 
                    label="Recipe Name" 
                    required
                    className={classes.name}
                    onChange={(e) => setName(e.target.value)}/>
                </div>
                <div className={classes.inputField}>
                    <TextField 
                    variant="outlined" 
                    label="Ingredients" 
                    required
                    error={isIngredientsError}
                    helperText={ingredientsErrorText}
                    multiline
                    rows={6}
                    className={classes.ingredients}
                    onChange={(e) => setIngredients(e.target.value)}/>
                </div>
                <div className={classes.inputField}>
                    <TextField 
                    variant="outlined" 
                    label="Directions" 
                    required
                    error={isDirectionsError}
                    helperText={directionsErrorText}
                    multiline
                    rows={6}
                    className={classes.directions}
                    onChange={(e) => setDirections(e.target.value)}/>
                </div>
                <div className={classes.inputField}>
                    <TextField 
                    variant="outlined" 
                    label="Image Url" 
                    placeholder="Paste a url for an image hosted somewhere (like imgr)" 
                    className={classes.imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}/>
                </div>
                <Button 
                    color="primary" 
                    variant="contained"
                    disabled={isNameError || isIngredientsError || isDirectionsError}
                    //onClick={() => submitRecipe({variables: {name, directions, ingredients, imageUrl}})}> 
                    onClick={() => onSubmitRecipe(name, directions, ingredients, imageUrl)}>
                    Create New Recipe 
                </Button>
            </Paper>
        }
        {loading && <CircularProgress/>}
    </Container>;
}

export default CreateRecipe;

const onSubmitRecipe = (name: string, directions: string, ingredients: string, imageUrl: string) => {
    if (name == null) {
        console.log("Name cannot be null");
    }
}