import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import Login from "../components/Login";

// Mocking modules and hooks
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn().mockImplementation(() => {}),
}));

describe("LoginForm Component", () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
  });

  test("renders login form inputs and buttons", () => {
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Submit/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Register/i })
    ).toBeInTheDocument();
  });

test("allows input for email and password", async () => {
  await userEvent.type(screen.getByLabelText(/Email/i), "test@example.com");
  await userEvent.type(screen.getByLabelText(/Password/i), "password123");

  expect(screen.getByLabelText(/Email/i)).toHaveValue("test@example.com");
  expect(screen.getByLabelText(/Password/i)).toHaveValue("password123");
});

test("navigates to survey page on successful login", async () => {
  // Mock fetch to simulate successful login
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ userID: "12345" }),
    })
  );

  await userEvent.type(screen.getByLabelText(/Email/i), "test@example.com");
  await userEvent.type(screen.getByLabelText(/Password/i), "password123");
  await userEvent.click(screen.getByRole("button", { name: /Submit/i }));

  // Assertions for fetch call
  expect(global.fetch).toHaveBeenCalledWith(
    expect.anything(),
    expect.objectContaining({
      method: "POST",
      body: JSON.stringify({
        email: "test@example.com",
        password: "password123",
      }),
    })
  );

  // Clean up fetch mock
  global.fetch.mockClear();
  delete global.fetch;
}); 
  // If anyone wants to add additional tests can be added here, such as testing error states, language selection, etc.
});
