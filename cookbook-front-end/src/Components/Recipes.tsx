import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {CircularProgress, GridList, GridListTile, GridListTileBar} from '@material-ui/core';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Error from './Error';
import OutdoorGrillIcon from '@material-ui/icons/OutdoorGrill';


const useStyles = makeStyles((theme) => ({
    recipesRoot: {
    },
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
        marginTop: theme.spacing(2)
    },
    gridList: {
        width: "100%"
    },
    cardLink: {
        textDecoration: "none"
    },
    tile: {
        height: 400,
        width: 400,
        padding: theme.spacing(2)
    },
    image: {
        width: "100%",
        maxHeight: "100%"
    },
    iconImage: {
        width: 150,
        height: 150,
        color: theme.palette.grey[700]
    },
    imageWrapper: {
        textAlign: "center"
    }
}));

export const GET_RECIPES = gql`
query Recipes{
    recipes {
        recipeId,
        name,
        imageUrl,
        creator {
            firstName,
            lastName
        }
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
    <div className={classes.root}>
        <GridList cols={3} spacing={4} className={classes.gridList}>
            {data.recipes.map((r: any) => (
                <GridListTile cols={1} className={classes.tile}>
                    <Link to={`recipes/${r.recipeId}`} className={classes.cardLink} key={r.recipeId}>
                        <div className={classes.imageWrapper}>
                        {
                            !!r.imageUrl
                            ? <img src={r.imageUrl} alt={r.name} className={classes.image}/>
                            : <OutdoorGrillIcon className={classes.iconImage}/>
                        }
                        </div>
                        <GridListTileBar
                            title={r.name}
                            subtitle={<span>by: {r.creator.firstName} {r.creator.lastName}</span>}/>
                    </Link>
                </GridListTile>
            ))}
        </GridList>
    </div>
    </>;
}

export default Recipes;
