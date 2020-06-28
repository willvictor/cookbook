import { Sequelize } from "sequelize-typescript";
import "jest";
import {
  SetupTestDatabase,
  TearDownTestDatabase,
  RunDbUpOnTestDb,
  GetTestSequelize
} from "./TestUtilties";
import { ApolloServer } from "apollo-server-express";
import { createTestClient } from "apollo-server-testing";
import { schema } from "../server/GraphQL/GraphQLSchema";
import { User } from "../database/models/User";
import { deleteRecipeResult } from "../server/GraphQL/Resolvers/DeleteRecipeResolver";
import { Recipe } from "../database/models/Recipe";
import {
  RECIPES,
  LOGIN,
  CREATE_RECIPE,
  DELETE_RECIPE
} from "./GraphqlTestQueries";
import * as GoogleAuthFactory from "../server/GoogleOAuthFactory";

let testSequelize: Sequelize;
const mockGetGoogleAuthClient = jest.fn(() => {
  return {
    verifyIdToken: (config: { idToken: any; audience: any }) =>
      Promise.resolve({
        getPayload: () => ({
          given_name: "Will",
          family_name: "Victor",
          email: "Dummy email",
          picture: "DummyPicture",
          sub: config.idToken
        })
      })
  } as any;
});

beforeAll(async () => {
  await SetupTestDatabase();
  await RunDbUpOnTestDb();
  jest
    .spyOn(GoogleAuthFactory, "GetGoogleAuthClient")
    .mockImplementation(mockGetGoogleAuthClient);
});

afterAll(async () => {
  await TearDownTestDatabase();
});

beforeEach(() => {
  //confirm a few things about the tables on the DB
  testSequelize = GetTestSequelize();
});

afterEach(() => {
  if (testSequelize) {
    testSequelize.close();
  }
});

describe("GraphQL", async () => {
  let session: { isAuthenticated: boolean; userId: number | null } = {
    isAuthenticated: false,
    userId: null
  };
  const server = new ApolloServer({
    schema: schema,
    context: async ({ req }) => ({ session: session })
  });
  const { query, mutate } = createTestClient(server);

  test("has no recipes by default", async () => {
    const { data } = (await query({
      query: RECIPES,
      variables: {}
    })) as any;
    expect(data).toEqual({ recipes: [] });
  });

  test("has no users by default", async () => {
    const users = await User.findAll();
    expect(users).toEqual([]);
  });

  test("Login for first time (create user)", async () => {
    const { data } = (await mutate({
      mutation: LOGIN,
      variables: { googleTokenId: "dummy_value" }
    })) as any;
    expect(mockGetGoogleAuthClient).toHaveBeenCalledTimes(1);
    expect(data).toEqual({
      login: {
        userId: 1,
        firstName: "Will",
        lastName: "Victor",
        imageUrl: "DummyPicture"
      }
    });
    expect(session).toEqual({ isAuthenticated: true, userId: 1 });
  });

  test("Login for second time (find user)", async () => {
    const { data } = (await mutate({
      mutation: LOGIN,
      variables: { googleTokenId: "dummy_value" }
    })) as any;
    expect(data).toEqual({
      login: {
        userId: 1,
        firstName: "Will",
        lastName: "Victor",
        imageUrl: "DummyPicture"
      }
    });
    const users = await User.findAll();
    expect(users.length).toEqual(1);
  });

  test("Cannot create recipe if not logged in", async () => {
    session.isAuthenticated = false;
    session.userId = null;
    const { data } = (await mutate({
      mutation: CREATE_RECIPE,
      variables: {
        name: "recipe1",
        directions: "directions1",
        ingredients: "ingredients1",
        imageUrl: "image1"
      }
    })) as any;
    expect(data.createRecipe).toBe(null);
    //confirm recipe not created (to be safe)
    const recipes = await Recipe.findAll();
    expect(recipes.length).toEqual(0);
  });

  test("Create 3 recipes", async () => {
    //set session auth
    session.isAuthenticated = true;
    session.userId = 1;
    const { data: data1 } = (await mutate({
      mutation: CREATE_RECIPE,
      variables: {
        name: "recipe1",
        directions: "directions1",
        ingredients: "ingredients1",
        imageUrl: "image1"
      }
    })) as any;
    const { data: data2 } = (await mutate({
      mutation: CREATE_RECIPE,
      variables: {
        name: "recipe2",
        directions: "directions2",
        ingredients: "ingredients2",
        imageUrl: "image2"
      }
    })) as any;
    const { data: data3 } = (await mutate({
      mutation: CREATE_RECIPE,
      variables: {
        name: "recipe3",
        directions: "directions3",
        ingredients: "ingredients3",
        imageUrl: "image3"
      }
    })) as any;
    const recipes = [
      data1.createRecipe,
      data2.createRecipe,
      data3.createRecipe
    ];
    recipes.forEach((recipe, index) => {
      expect(recipe.recipeId).toEqual(index + 1);
      expect(recipe.name).toEqual(`recipe${index + 1}`);
      expect(recipe.imageUrl).toEqual(`image${index + 1}`);
      expect(recipe.creator.firstName).toEqual("Will");
    });
  });

  test("Read all recipes", async () => {
    const { data } = (await query({
      query: RECIPES,
      variables: {}
    })) as any;
    expect(data.recipes.length).toEqual(3);
    (data.recipes as any[]).forEach((recipe, index) => {
      expect(recipe.recipeId).toEqual(index + 1);
      expect(recipe.name).toEqual(`recipe${index + 1}`);
      expect(recipe.imageUrl).toEqual(`image${index + 1}`);
      expect(recipe.creator.firstName).toEqual("Will");
    });
  });

  test("Cannot delete recipe if not logged in", async () => {
    session.isAuthenticated = false;
    session.userId = null;
    const { data } = (await mutate({
      mutation: DELETE_RECIPE,
      variables: { recipeId: 2 }
    })) as any;
    expect(data).toEqual({
      deleteRecipe: deleteRecipeResult.notLoggedIn
    });
    const recipe = (await Recipe.findByPk(2)) as Recipe;
    expect(recipe.dateDeleted).toBe(null);
  });

  test("Cannot delete recipe if not owner", async () => {
    session.isAuthenticated = true;
    session.userId = 2; //not Will
    const { data } = (await mutate({
      mutation: DELETE_RECIPE,
      variables: { recipeId: 2 }
    })) as any;
    expect(data).toEqual({
      deleteRecipe: deleteRecipeResult.sessionUserIsNotCreator
    });
    const recipe = (await Recipe.findByPk(2)) as Recipe;
    expect(recipe.dateDeleted).toBe(null);
  });

  test("Delete recipe", async () => {
    session.isAuthenticated = true;
    session.userId = 1;
    const { data } = (await mutate({
      mutation: DELETE_RECIPE,
      variables: { recipeId: 2 }
    })) as any;
    expect(data).toEqual({
      deleteRecipe: deleteRecipeResult.successfullyDeleted
    });
    const recipe = (await Recipe.findByPk(2)) as Recipe;
    expect(recipe.dateDeleted).not.toBe(null);
  });

  test("Query recipes without deleted", async () => {
    const { data } = (await query({
      query: RECIPES,
      variables: {}
    })) as any;
    expect(data.recipes.length).toEqual(2);
  });

  test("Query single recipe", async () => {
    const { data } = (await query({
      query: RECIPES,
      variables: { recipeIds: 3 }
    })) as any;
    expect(data.recipes).toEqual([
      {
        recipeId: 3,
        name: "recipe3",
        directions: "directions3",
        ingredients: "ingredients3",
        imageUrl: "image3",
        creator: {
          firstName: "Will",
          lastName: "Victor",
          userId: 1
        }
      }
    ]);
  });
});
