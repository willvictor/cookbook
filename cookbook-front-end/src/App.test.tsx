import React from "react";
import { render, wait, fireEvent } from "@testing-library/react";
import App from "./App";

import { GET_APP_STATE } from "./GraphqlQueries/AppStateQuery";
import { CREATE_RECIPE } from "./GraphqlQueries/CreateRecipeQuery";
import { DELETE_RECIPE } from "./GraphqlQueries/DeleteRecipeQuery";
import { GET_RECIPES } from "./GraphqlQueries/GetRecipesQuery";
import { LOGIN } from "./GraphqlQueries/LoginQuery";
import { Recipe } from "./GraphqlQueryTypes/RecipeType";
import { User } from "./GraphqlQueryTypes/UserType";
import { MockedProvider } from "@apollo/react-testing";
import { AppState } from "./GraphqlQueryTypes/AppStateType";
import { InMemoryCache } from "apollo-boost";

const users: User[] = [
  {
    userId: 1,
    firstName: "will",
    lastName: "victor",
    imageUrl: "willimage"
  },
  {
    userId: 2,
    firstName: "chris",
    lastName: "dieckhause",
    imageUrl: "chrisimage"
  }
];
const recipes: Recipe[] = [
  {
    recipeId: 1,
    name: "r1",
    ingredients: "i1",
    directions: "d1",
    imageUrl: "img1",
    creator: users[0]
  },
  {
    recipeId: 2,
    name: "r2",
    ingredients: "i2",
    directions: "d2",
    imageUrl: "img2",
    creator: users[0]
  },
  {
    recipeId: 3,
    name: "r3",
    ingredients: "i3",
    directions: "d3",
    imageUrl: "img3",
    creator: users[1]
  }
];

const appState: AppState = {
  sessionUser: null,
  googleClientId: "DUMMY_TEST_VALUE",
  deletedRecipeToastIsOpen: false
};

const mocks = [
  {
    request: {
      query: GET_RECIPES
    },
    result: {
      data: {
        recipes: recipes
      }
    }
  },
  {
    request: {
      query: GET_APP_STATE
    },
    result: {
      data: appState
    }
  },
  {
    request: {
      query: GET_RECIPES,
      arguments: {
        recipeIds: [2]
      }
    },
    result: {
      data: {
        recipes: recipes.filter(r => r.recipeId == 2)
      }
    }
  }
];

jest.mock("react-google-login", () => {
  const FakeLogin = jest.fn(({ children }) => children);
  return { GoogleLogin: FakeLogin };
});

describe("Core front end functionality tests", () => {
  test("Renders recipe browse by default", async () => {
    const { queryByText, queryAllByText } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <App />
      </MockedProvider>
    );
    await wait();
    const cookbookHeader = queryByText(/Cookbook/i);
    expect(cookbookHeader).toBeInTheDocument();

    const login = queryByText(/Login/i);
    expect(login).not.toBeInTheDocument();

    const directions = queryByText(/Directions/i);
    expect(directions).not.toBeInTheDocument();

    const recipe2 = queryByText(/r2/i);
    expect(recipe2).toBeInTheDocument();

    const willsName = queryAllByText(/will/i);
    expect(willsName.length).toEqual(2);

    const chris = queryByText(/dieckhaus/i);
    expect(chris).toBeInTheDocument();
  });

  test("Click on recipe goes to recipe detail", async () => {
    /*
    let cache = new InMemoryCache();
    const data = {
      deletedRecipeToastIsOpen: false
    };
    cache.writeData({ data });
    const { getByText, queryByText, queryByTestId } = render(
      <MockedProvider mocks={mocks} addTypename={false} cache={cache}>
        <App />
      </MockedProvider>
    );
    await wait();
    const recipe2Tile = getByText("r2");
    fireEvent.click(recipe2Tile);
    await wait();
    //expect correct recipe detail to show
    expect(queryByText(/r2/i)).toBeInTheDocument();
    expect(queryByText(/Created by: will victor/i)).toBeInTheDocument();
    expect(queryByText(/directions/i)).toBeInTheDocument();
    expect(queryByText(/ingredients/i)).toBeInTheDocument();
    expect(queryByText(/d2/i)).toBeInTheDocument();
    expect(queryByText(/i2/i)).toBeInTheDocument();

    //expect recipe 1 to have no visible context
    expect(queryByText(/r1/i)).not.toBeInTheDocument();

    //expect delete symbol not visible since we aren't logged in
    expect(queryByTestId("delete-recipe-button")).not.toBeInTheDocument();
    */
  });

  test("Login makes creating recipe possible", async () => {});
});
