import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Container, Paper, TextField, CircularProgress, Button} from '@material-ui/core';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import {Panels} from '../App';


const useStyles = makeStyles((theme) => ({
    paper: {
        paddingBottom: theme.spacing(2),
        paddingLeft: theme.spacing(2)
    },
    header: {
        textAlign: 'center'
    },
    name: {
        minWidth: "50%"
    },
    ingredients: {
        minWidth: "50%",
    },
    directions: {
        minWidth: "50%",
    },
    inputField: {
        marginBottom: theme.spacing(2)
    }
}));

const SUBMIT_RECIPE = gql`
    mutation CreateRecipe($name: String!, $directions: String!, $ingredients: String!){
        createRecipe(name:$name, directions:$directions, ingredients: $ingredients){
            id
        }
    }`; 

const CreateRecipe = () => {
    const classes = useStyles();
    const [name, setName] = useState("Recipe Name");
    const [ingredients, setIngredients] = useState("1 egg, 2 cups milk..." );
    const [directions, setDirections] = useState("Combine Eggs and milk, then heat over medium flame...");
    const [submitRecipe, {data, loading}] = useMutation(
        SUBMIT_RECIPE, 
        {
            update: (cache, mutationResult) => {
                cache.writeData({
                    data: {
                        currentPanel: Panels.recipeDetail,
                        recipeDetailId: mutationResult.data.createRecipe.id
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
                    defaultValue="Recipe Name" 
                    className={classes.name}
                    onChange={(e) => setName(e.target.value)}/>
                </div>
                <div className={classes.inputField}>
                    <TextField 
                    variant="outlined" 
                    label="Ingredients" 
                    defaultValue="1 egg, 2 cups milk..." 
                    className={classes.ingredients}
                    multiline={true}
                    onChange={(e) => setIngredients(e.target.value)}/>
                </div>
                <div className={classes.inputField}>
                    <TextField 
                    variant="outlined" 
                    label="Directions" 
                    defaultValue="Combine Eggs and milk, then heat over medium flame..." 
                    className={classes.directions}
                    multiline={true}
                    onChange={(e) => setDirections(e.target.value)}/>
                </div>
                <Button 
                    color="primary" 
                    variant="contained"
                    onClick={() => submitRecipe({variables: {name, directions, ingredients}})}> 
                    Create New Recipe 
                </Button>
            </Paper>
        }
        {loading && <CircularProgress/>}
    </Container>;
}

export default CreateRecipe;
