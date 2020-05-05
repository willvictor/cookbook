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
    const [name, setName] = useState("Recipe Name");
    const [ingredients, setIngredients] = useState("1 egg, 2 cups milk..." );
    const [directions, setDirections] = useState("Combine Eggs and milk, then heat over medium flame...");
    const [imageUrl, setImageUrl] = useState("Paste a url for an image hosted somewhere (like imgr)");
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

    return <Container maxWidth="lg">
        {   !loading 
            && !data 
            && <Paper className={classes.paper}>
                <div className={classes.header}>
                    <h1>Create a new recipe</h1>
                </div>
                <div className={classes.inputField}>
                    <TextField 
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
                    onClick={() => submitRecipe({variables: {name, directions, ingredients, imageUrl}})}> 
                    Create New Recipe 
                </Button>
            </Paper>
        }
        {loading && <CircularProgress/>}
    </Container>;
}

export default CreateRecipe;
