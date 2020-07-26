import React from "react";
import {
  render,
  wait,
  fireEvent,
  screen,
  findByLabelText,
  findByTestId
} from "@testing-library/react";
import App from "./App";

jest.mock("react-google-login", () => {
  const FakeLogin = jest.fn(({ render, onSuccess }) => {
    return render({
      onClick: () =>
        onSuccess({
          getAuthResponse: () => ({
            id_token: "DUMMY_ID_TOKEN"
          })
        }),
      disabled: false
    });
  });
  return { GoogleLogin: FakeLogin };
});

describe("Core front end functionality tests", () => {
  test("Visit homepage", async () => {
    const { queryByText, findAllByText, findByText } = render(<App />);
    const cookbookHeader = await findByText(/Cookbook/i);
    expect(cookbookHeader).toBeInTheDocument();

    const login = await findByText(/Login/i);
    expect(login).toBeInTheDocument();

    const recipe2 = await findByText(/r2/i);
    expect(recipe2).toBeInTheDocument();

    const directions = queryByText(/Directions/i);
    expect(directions).not.toBeInTheDocument();

    const willsName = await findAllByText(/will/i);
    expect(willsName.length).toEqual(2);

    const chris = await findByText(/dieckhaus/i);
    expect(chris).toBeInTheDocument();
  });

  test("Visit recipe detail", async () => {
    const { queryByText, queryByTestId, findByText } = render(<App />);
    const recipe2Tile = await findByText("r2");
    fireEvent.click(recipe2Tile);
    //expect correct recipe detail to show
    expect(await findByText(/r2/i)).toBeInTheDocument();
    expect(await findByText(/Created by will victor/i)).toBeInTheDocument();
    expect(await findByText(/Directions/i)).toBeInTheDocument();
    expect(await findByText(/Ingredients/i)).toBeInTheDocument();
    expect(await findByText(/d2/i)).toBeInTheDocument();
    expect(await findByText(/i2/i)).toBeInTheDocument();

    //expect recipe 1 to have no visible context
    expect(queryByText(/r1/i)).not.toBeInTheDocument();

    //expect delete symbol not visible since we aren't logged in
    expect(queryByTestId("delete-recipe-button")).not.toBeInTheDocument();
  });

  test("Login, create recipe", async () => {
    const { queryByText, findByText, findByTestId } = render(<App />);

    const login = await findByText(/Login/i);
    expect(login).toBeInTheDocument();
    expect(queryByText(/Add Recipe/i)).not.toBeInTheDocument();

    fireEvent.click(login);

    const addRecipe = await findByText(/Add Recipe/i);
    expect(addRecipe).toBeInTheDocument();
    expect(queryByText(/Login/i)).not.toBeInTheDocument();

    fireEvent.click(addRecipe);

    const header = await findByText(/Create a new recipe/i);
    expect(header).toBeInTheDocument();
    expect(queryByText(/r2/i)).not.toBeInTheDocument();

    //cannot create recipe until form filled out
    const button = await findByText(/CREATE NEW RECIPE/i);
    expect(button).toBeDisabled();

    const recipeName = await findByTestId("recipeName");
    const ingredients = await findByTestId("ingredients");
    const directions = await findByTestId("directions");
    const imageUrl = await findByTestId("imageUrl");

    fireEvent.change(recipeName, { target: { value: "r4" } });
    fireEvent.change(ingredients, { target: { value: "i4" } });
    fireEvent.change(directions, { target: { value: "d4" } });
    fireEvent.change(imageUrl, { target: { value: "img4" } });

    expect(button).not.toBeDisabled();

    fireEvent.click(button);

    expect(await findByText(/r4/)).toBeInTheDocument();
    expect(await findByText(/d4/)).toBeInTheDocument();
    expect(await findByText(/i4/)).toBeInTheDocument();

    expect(await findByTestId("delete-recipe-button")).toBeInTheDocument();

    const homeButton = await findByTestId("home-button");

    fireEvent.click(homeButton);

    expect(await findByText(/r1/i)).toBeInTheDocument();
    expect(await findByText(/r4/i)).toBeInTheDocument();
    expect(queryByText(/i4/i)).not.toBeInTheDocument();
  });

  test("Delete recipe", async () => {
    const { queryByText, findByText, findByTestId } = render(<App />);

    const login = await findByText(/Login/i);
    fireEvent.click(login);

    fireEvent.click(await findByText(/r2/i));

    const deleteButton = await findByTestId("delete-recipe-button");
    expect(deleteButton).toBeInTheDocument();

    fireEvent.click(deleteButton);

    expect(
      await findByText(/Are you sure you want to delete this recipe?/i)
    ).toBeInTheDocument();

    fireEvent.click(await findByText(/yes/i));

    expect(await findByText(/r1/i)).toBeInTheDocument();
    expect(await findByText(/r3/i)).toBeInTheDocument();
    expect(queryByText(/r2/i)).not.toBeInTheDocument();
  });
});
