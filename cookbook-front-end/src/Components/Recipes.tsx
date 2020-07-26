import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  CircularProgress,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography
} from "@material-ui/core";
import { useQuery } from "@apollo/react-hooks";
import Error from "./Error";
import { GET_RECIPES } from "../GraphqlQueries/GetRecipesQuery";
import { RecipesResult } from "../GraphqlQueryTypes/RecipesResultType";

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(2)
  },
  card: {
    display: "block",
    height: "100%",
    width: "100%"
  },
  cardLink: {
    textDecoration: "none",
    color: theme.palette.text.primary
  },
  imageWrapper: {
    textAlign: "center"
  },
  image: {
    height: 300
  },
  cardContent: {
    height: "10%"
  }
}));

const Recipes = () => {
  const classes = useStyles();
  const { loading, error, data } = useQuery<RecipesResult>(GET_RECIPES, {
    variables: { recipeIds: null }
  });

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Error errorMessage={error.message} />;
  }

  if (!data) {
    return <Error errorMessage={"unexpected error occurred"} />;
  }

  const recipes = data.recipes;

  return (
    <>
      <Grid container className={classes.root} spacing={2}>
        {recipes.map((r: any) => (
          <Grid item xs={12} sm={4} key={r.recipeId}>
            <Card className={classes.card}>
              <Link
                to={`recipes/${r.recipeId}`}
                key={r.recipeId}
                className={classes.cardLink}
              >
                <div className={classes.imageWrapper}>
                  <CardMedia
                    component="img"
                    image={
                      !r.imageUrl
                        ? "https://i.imgur.com/1bWgz2X.png"
                        : r.imageUrl
                    }
                    alt={r.name}
                    className={classes.image}
                  />
                </div>
                <CardContent className={classes.cardContent}>
                  <Typography variant="h6">{r.name}</Typography>
                  <Typography variant="subtitle1">
                    By: {r.creator.firstName} {r.creator.lastName}
                  </Typography>
                </CardContent>
              </Link>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default Recipes;
