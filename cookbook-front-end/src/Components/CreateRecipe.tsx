import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Container, Paper, TextField, CircularProgress, Button} from '@material-ui/core';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useHistory } from 'react-router';
import { GET_RECIPES } from './Recipes';
import { Alert } from '@material-ui/lab';

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
            recipeId,
            name,
            imageUrl
        }
    }`; 

const CreateRecipe = () => {
    const classes = useStyles();
    const [name, setName] = useState(null as any);
    const [ingredients, setIngredients] = useState(null as any);
    const [directions, setDirections] = useState(null as any);
    const [imageUrl, setImageUrl] = useState(null as any);

    const [isNameError, setIsNameError] = useState(false);
    const [isIngredientsError, setIsIngredientsError] = useState(false);
    const [isDirectionsError, setIsDirectionsError] = useState(false);
    const [isAnyEditMade, setIsAnyEditMade] = useState(false);
    const [isAuthError, setIsAuthError] = useState(false)

    let history = useHistory();

    const [submitRecipe, {data, loading}] = useMutation(
        SUBMIT_RECIPE, 
        {
            update: (cache, mutationResult) => {
                if (!mutationResult.data.createRecipe.userWasAuthenticated){
                    setIsAuthError(true);
                    return;
                }
                const cacheContents = cache.readQuery({ query: GET_RECIPES }) as any;
                cache.writeQuery({
                    query: GET_RECIPES,
                    data: { recipes: cacheContents.recipes.concat([mutationResult.data.createRecipe.createdRecipe]) },
                });
                history.push(`/recipes/${mutationResult.data.createRecipe.createdRecipe.recipeId}`);
            }
        });

    const nameErrorText = isNameError ? "Recipe name is required" : null;
    const ingredientsErrorText = isIngredientsError ? "Ingredients are required" : null;
    const directionsErrorText = isDirectionsError ? "Directions are required" : null;

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
                    onChange={(e) => onFieldChange(e.target.value, setName, setIsNameError, setIsAnyEditMade)}/>
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
                    onChange={(e) => onFieldChange(e.target.value, setIngredients, setIsIngredientsError, setIsAnyEditMade)}/>
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
                    onChange={(e) => onFieldChange(e.target.value, setDirections, setIsDirectionsError, setIsAnyEditMade)}/>
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
                    disabled={isNameError || isIngredientsError || isDirectionsError || !isAnyEditMade}
                    onClick={() => submitRecipe({variables: {name, directions, ingredients, imageUrl}})}> 
                    Create New Recipe 
                </Button>
                {
                    isAuthError && <Alert severity={"error"}>Please login to create a recipe</Alert>
                }
            </Paper>
        }
        {loading && <CircularProgress/>}
    </Container>;
}

export default CreateRecipe;

const onFieldChange = (field: string, updateFieldFunc: Function, updateErrorFunc: Function, setIsAnyEditMade: Function): void => {
    updateFieldFunc(field);
    setIsAnyEditMade(true);

    if (updateErrorFunc === null) {
        return;
    }

    if (isInvalidField(field)) {
        updateErrorFunc(true);
    } else {
        updateErrorFunc(false);
    }
};

const isInvalidField = (field: string): boolean => {
    return field === null || field === "";
};
