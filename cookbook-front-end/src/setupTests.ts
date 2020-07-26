// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/extend-expect";

import { setupServer } from "msw/node";
import { graphql } from "msw";
import { DeleteRecipeResult } from "./GraphqlQueryTypes/DeleteRecipeResultType";

const users = [
  {
    __typename: "User",
    userId: 1,
    firstName: "will",
    lastName: "victor",
    imageUrl: "willimage"
  },
  {
    __typename: "User",
    userId: 2,
    firstName: "chris",
    lastName: "dieckhaus",
    imageUrl: "chrisimage"
  }
];
const baseRecipes = [
  {
    __typename: "Recipe",
    recipeId: 1,
    name: "r1",
    ingredients: "i1",
    directions: "d1",
    imageUrl: "img1",
    creator: users[0]
  },
  {
    __typename: "Recipe",
    recipeId: 2,
    name: "r2",
    ingredients: "i2",
    directions: "d2",
    imageUrl: "img2",
    creator: users[0]
  },
  {
    __typename: "Recipe",
    recipeId: 3,
    name: "r3",
    ingredients: "i3",
    directions: "d3",
    imageUrl: "img3",
    creator: users[1]
  }
];

let recipes = baseRecipes;

const server = setupServer(
  graphql.query("Recipes", (req, res, ctx) => {
    const { recipeIds } = req.variables;
    if (!recipeIds) {
      return res(
        ctx.data({
          recipes: recipes
        })
      );
    }
    return res(
      ctx.data({
        recipes: recipes.filter(r => recipeIds.includes(r.recipeId))
      })
    );
  }),
  graphql.query("SessionInfo", (req, res, ctx) => {
    return res(
      ctx.data({
        sessionUser: null,
        googleClientId: "Dummy"
      })
    );
  }),
  graphql.mutation("Login", (req, res, ctx) => {
    return res(
      ctx.data({
        login: users[0]
      })
    );
  }),
  graphql.mutation("CreateRecipe", (req, res, ctx) => {
    const { name, ingredients, directions, imageUrl } = req.variables;
    recipes = recipes.concat([
      {
        __typename: "Recipe",
        recipeId: 4,
        name: name,
        directions: directions,
        ingredients: ingredients,
        imageUrl: imageUrl,
        creator: users[0]
      }
    ]);
    return res(
      ctx.data({
        createRecipe: recipes[3]
      })
    );
  }),
  graphql.mutation("DeleteRecipe", (req, res, ctx) => {
    const { recipeId } = req.variables;
    recipes = recipes.filter(r => r.recipeId !== recipeId);
    return res(
      ctx.data({
        deleteRecipe: DeleteRecipeResult.successfullyDeleted
      })
    );
  })
);

beforeAll(() => {
  // Enable the mocking in tests.
  server.listen();
});

afterEach(() => {
  // reset recipes to base recipes in case it changed
  recipes = baseRecipes;
  // Reset any runtime handlers tests may use.
  server.resetHandlers();
});

afterAll(() => {
  // Clean up once the tests are done.
  server.close();
});
