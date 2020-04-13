import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Card, CardHeader, CardActions, Button, CircularProgress, createMuiTheme} from '@material-ui/core';
import { useQuery, useApolloClient} from '@apollo/react-hooks';
import gql from 'graphql-tag';

const theme = createMuiTheme();

const useStyles = makeStyles({
});


export interface Props {
    recipeId: number
}

const RecipeDetail = (props: Props) => {
    const GET_RECIPES = gql`
    {
        recipe(id:${props.recipeId}) {
            id,
            name,
            ingredients,
            description
        }
    }`;
    const classes = useStyles();
    const { loading, error, data } = useQuery(GET_RECIPES);
    if(loading) return <CircularProgress/>;
    if(error) return <span>oh no, an error occured</span>;
    return <>
        {data}
    </>;
}

export default RecipeDetail;
