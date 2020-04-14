import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Card, CardHeader, CardActions, Button, CircularProgress} from '@material-ui/core';
import { useQuery, useApolloClient} from '@apollo/react-hooks';
import gql from 'graphql-tag';
import {Panels} from '../App';


const useStyles = makeStyles((theme) => ({
    recipesRoot: {

    },
    cardRoot: {
        marginTop: theme.spacing(2)
    },
}));

const GET_RECIPES = gql`
  {
    recipes {
      id,
      name
    }
  }
`;

const Recipes = () => {
  const classes = useStyles();
  const { loading, error, data } = useQuery(GET_RECIPES);
  const client = useApolloClient();
  if(loading) return <CircularProgress/>;
  if(error) return <span>oh no, an error occured</span>;
  return <>
        <div className={classes.recipesRoot}>
            {data.recipes.map((r: any) => {
                return <Card className = {classes.cardRoot} key={r.id}>
                    <CardHeader title={r.name}/>
                    <CardActions>
                        <Button 
                            size="small"
                            onClick={()=> client.writeData({
                                data: {
                                    currentPanel: Panels.recipeDetail,
                                    recipeDetailId: r.id
                                },
                            })}>
                            View Recipe
                        </Button>
                    </CardActions>
                </Card>
            })}
        </div>
    </>;
}

export default Recipes;
