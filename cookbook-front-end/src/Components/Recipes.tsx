import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {Card, CardHeader, CardActions, CircularProgress, CardMedia} from '@material-ui/core';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Error from './Error';


const useStyles = makeStyles((theme) => ({
    recipesRoot: {
    },
    cardRoot: {
        marginTop: theme.spacing(2),
        display: "flex",
        padding: theme.spacing(2)
    },
    cardTitle: {
        flexGrow: 1
    },
    media: {
        height: 100,
        width: 100,
        borderRadius: 10
    }
}));

const GET_RECIPES = gql`
query Recipes{
    recipes {
        recipeId,
        name,
        imageUrl
    }
}
`;

const Recipes = () => {
  const classes = useStyles();
  const { loading, error, data } = useQuery(GET_RECIPES);
  
  if (loading) {
      return <CircularProgress/>;
  }

  if (error) {
    return <Error errorMessage={error.message} />;
  }

  return <>
        <div className={classes.recipesRoot}>
          {data.recipes.map((r: any) => {
              return <Card className = {classes.cardRoot} key={r.recipeId}>
                  <CardHeader title={r.name} className={classes.cardTitle}/>
                  <CardActions>
                      <Link to={`recipes/${r.recipeId}`}>View recipe</Link>
                  </CardActions>
                  <CardMedia
                      className={classes.media}
                      image={r.imageUrl}
                      title={r.name}
                  />
              </Card>
          })}
        </div>
    </>;
}

export default Recipes;
