import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Container, Paper, TextField, CircularProgress, Button} from '@material-ui/core';
import { useMutation } from '@apollo/react-hooks';
import { useHistory } from 'react-router';
import { CREATE_RECIPE } from '../GraphqlQueries/CreateRecipeQuery';
import { GET_RECIPES } from '../GraphqlQueries/GetRecipesQuery';
import { Alert } from '@material-ui/lab';
import { CreateRecipeResult } from '../GraphqlQueryTypes/CreateRecipeResultType';
import { Recipe } from '../GraphqlQueryTypes/RecipeType';

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
    },
    alert: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2)
    }
}));

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

    const [submitRecipe, {loading}] = useMutation<CreateRecipeResult>(
        CREATE_RECIPE, 
        {
            update: (cache, {data}) => {
                if (!data){
                    return;
                }
                if (!data.createRecipe.userWasAuthenticated){
                    setIsAuthError(true);
                    return;
                }
                const recipes = cache.readQuery<Recipe[]>({ query: GET_RECIPES });
                if (recipes){
                    cache.writeQuery({
                        query: GET_RECIPES,
                        data: {
                            recipes: recipes.concat([data.createRecipe.createdRecipe]) 
                        },
                    });
                }
                history.push(`/recipes/${data.createRecipe.createdRecipe.recipeId}`);
            }
        });

    const nameErrorText = isNameError ? "Recipe name is required" : null;
    const ingredientsErrorText = isIngredientsError ? "Ingredients are required" : null;
    const directionsErrorText = isDirectionsError ? "Directions are required" : null;

    return <Container maxWidth="lg">
        {   !loading 
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
                    isAuthError && <Alert className={classes.alert} severity={"error"}>Please login to create a recipe</Alert>
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
