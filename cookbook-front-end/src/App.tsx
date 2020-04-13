import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const GET_RECIPES = gql`
  {
    recipes {
      id,
      name
    }
  }
`;

const App = () => {
  const { loading, error, data } = useQuery(GET_RECIPES);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error {error.message}</p>;
  return <>
    <div className="App">
      <ul>
        {data.recipes.map((r : any) => <li>{r.name}</li>)}
      </ul>
    </div>
  </>;
}

export default App;
