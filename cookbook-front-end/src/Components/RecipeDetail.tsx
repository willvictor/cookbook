import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Paper,
  CircularProgress,
  CardMedia,
  Typography,
  IconButton
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { useQuery, useMutation } from "@apollo/react-hooks";
import Error from "./Error";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router";
import { GET_RECIPES } from "../GraphqlQueries/GetRecipesQuery";
import { DELETE_RECIPE } from "../GraphqlQueries/DeleteRecipeQuery";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import { RecipesResult } from "../GraphqlQueryTypes/RecipesResultType";
import { GET_APP_STATE } from "../GraphqlQueries/AppStateQuery";
import { AppState } from "../GraphqlQueryTypes/AppStateType";

const useStyles = makeStyles(theme => ({
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

enum DeleteRecipeResult {
  successfullyDeleted = 1,
  recipeIdNotValid = 2,
  notLoggedIn = 3,
  sessionUserIsNotCreator = 4
}

const RecipeDetail = () => {
  let { recipeId } = useParams();
  recipeId = parseInt(recipeId);

  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

  const classes = useStyles();
  const {
    loading: recipeLoading,
    error: recipeError,
    data: recipesData,
    client
  } = useQuery<RecipesResult>(GET_RECIPES, {
    variables: { recipeIds: [recipeId] }
  });
  const {
    loading: appStateLoading,
    error: appStateError,
    data: appState
  } = useQuery<AppState>(GET_APP_STATE);
  const history = useHistory();

  const [deleteRecipe, { loading: deleteRecipeLoading }] = useMutation<
    DeleteRecipeResult
  >(DELETE_RECIPE, {
    update: (cache, { data: deletedRecipeResult }) => {
      if (deletedRecipeResult !== DeleteRecipeResult.successfullyDeleted) {
        console.log("Did not successfully delete recipe");
      }
      const recipeResults = cache.readQuery<RecipesResult>({
        query: GET_RECIPES
      });
      if (recipeResults && recipeResults.recipes) {
        cache.writeQuery({
          query: GET_RECIPES,
          data: {
            ...recipeResults,
            recipes: recipeResults.recipes.filter(
              (recipe: any) => recipe.recipeId !== recipeId
            )
          }
        });
      }
      client.writeData({ data: { deletedRecipeToastIsOpen: true } });
      history.push(`/`);
    }
  });

  if (recipeLoading || deleteRecipeLoading || appStateLoading) {
    return <CircularProgress />;
  }

  if (recipeError || appStateError) {
    return (
      <Error
        errorMessage={
          recipeError ? recipeError.message : "an unexpected error occurred"
        }
      />
    );
  }
  if (!recipesData || !appState) {
    return <Error errorMessage="an unexpected error occurred" />;
  }

  const recipe = recipesData.recipes[0];
  return (
    <Paper className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {recipe.imageUrl ? (
            <CardMedia
              image={recipe.imageUrl}
              title={recipe.name}
              className={classes.media}
            />
          ) : (
            ""
          )}
        </Grid>
        <Grid item xs={12} className={classes.header}>
          <Grid item>
            <Typography variant="h4" className={classes.title}>
              {recipe.name}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="subtitle1" className={classes.subtitle}>
              Created by {recipe.creator.firstName} {recipe.creator.lastName}
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h5">Ingredients</Typography>
          <Typography variant="body1" className={classes.preformatted}>
            {recipe.ingredients}
          </Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="h5">Directions</Typography>
          <Typography variant="body1" className={classes.preformatted}>
            {recipe.directions}
          </Typography>
        </Grid>

        <Grid item xs={12} className={classes.deleteIconWrapper}>
          {appState.sessionUser &&
            recipe.creator.userId === appState.sessionUser.userId && (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="home"
                data-test-id="delete-recipe-button"
                onClick={() => setDeleteConfirmationOpen(true)}
              >
                <DeleteIcon />
              </IconButton>
            )}
        </Grid>
      </Grid>

      <Dialog
        open={deleteConfirmationOpen}
        onClose={() => setDeleteConfirmationOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to delete this recipe?"}
        </DialogTitle>
        <DialogActions>
          <Button
            onClick={() => setDeleteConfirmationOpen(false)}
            color="secondary"
          >
            No
          </Button>
          <Button
            onClick={() => {
              setDeleteConfirmationOpen(false);
              deleteRecipe({ variables: { recipeId: recipeId } });
            }}
            color="primary"
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default RecipeDetail;
