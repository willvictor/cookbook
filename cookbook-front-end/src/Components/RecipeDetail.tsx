import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Grid, Paper, CircularProgress, CardMedia, Typography, IconButton, Snackbar} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import DeleteIcon from '@material-ui/icons/Delete';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Error from './Error';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router';
import {GET_RECIPES } from './Recipes';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';

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
    },
    deleteIconWrapper: {
        display: "flex",
        flexDirection: "row-reverse"
    }
}));
const GET_RECIPE = gql`
query Recipe($recipeDetailId: Int){
    sessionUser{
        userId
    }
    recipe(recipeId:$recipeDetailId) {
        recipeId,
        name,
        ingredients,
        directions,
        imageUrl,
        creator {
            userId,
            firstName,
            lastName
        }
    }
}`;

const DELETE_RECIPE = gql`
mutation DeleteRecipe($recipeDetailId: Int){
    deleteRecipe(recipeId:$recipeDetailId)
}`;

const RecipeDetail = () => {
    let { recipeDetailId } = useParams();
    recipeDetailId = parseInt(recipeDetailId);

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

    const classes = useStyles();
    const { loading, error, data , client} = useQuery(GET_RECIPE, {variables: {recipeDetailId: recipeDetailId}});
    let history = useHistory();

    const [deleteRecipe, {loading: deleteRecipeLoading}] = useMutation(
        DELETE_RECIPE, 
        {
            update: (cache, mutationResult) => {
                const cacheContents = cache.readQuery({ query: GET_RECIPES }) as any;
                if (cacheContents.recipes){
                    cache.writeQuery({
                        query: GET_RECIPES,
                        data: { 
                            ...cacheContents,
                            recipes: cacheContents.recipes.filter((recipe: any) => recipe.recipeId !== recipeDetailId ) 
                        },
                    });
                }
                client.writeData({data: {deletedRecipeToastIsOpen: true}});
                history.push(`/`);
            }
        });
    
    if (loading || deleteRecipeLoading) {
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

            <Grid item xs={12} className={classes.deleteIconWrapper}>
                {
                    data.sessionUser && 
                    data.recipe.creator.userId === data.sessionUser.userId
                    &&
                    <IconButton 
                        edge="start"
                        color="inherit" 
                        aria-label="home">
                        <DeleteIcon onClick={() => setDeleteConfirmationOpen(true)}/>
                    </IconButton>
                }
            </Grid>
        </Grid>

        <Dialog
            open={deleteConfirmationOpen}
            onClose={() => setDeleteConfirmationOpen(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">{"Are you sure you want to delete this recipe?"}</DialogTitle>
            <DialogActions>
                <Button onClick={() => setDeleteConfirmationOpen(false)} color="secondary">
                    No
                </Button>
                <Button onClick={() =>  {
                    setDeleteConfirmationOpen(false);
                    deleteRecipe({variables: {recipeDetailId: recipeDetailId}});
                }} color="primary" autoFocus>
                    Yes
                </Button>
            </DialogActions>
        </Dialog>

    </Paper>;
}

export default RecipeDetail;
