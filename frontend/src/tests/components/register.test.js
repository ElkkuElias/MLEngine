import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";
import RegistrationForm from "../../components/register.js";

describe("Register Component", () => {
  beforeEach(() => {
    render(
      <Router>
        <RegistrationForm />
      </Router>
    );
  });

  test("renders registration form", () => {
    const firstNameInput = screen.getByLabelText(/First Name/i);
    const lastNameInput = screen.getByLabelText(/Last Name/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    expect(firstNameInput).toBeInTheDocument();
    expect(lastNameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();

    // You can also check for the submit button
    expect(screen.getByRole("button", { name: /Register/i })).toBeInTheDocument();
  });

  test("allows entering a username, email, and password", () => {
    const firstNameInput = screen.getByLabelText(/First Name/i);
    const lastNameInput = screen.getByLabelText(/Last Name/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    fireEvent.change(firstNameInput, { target: { value: "test" } });
    fireEvent.change(lastNameInput, { target: { value: "tester" } });
    fireEvent.change(emailInput, { target: { value: "user@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "newpassword" } });

    expect(firstNameInput).toHaveValue("test");
    expect(lastNameInput).toHaveValue("tester");
    expect(emailInput).toHaveValue("user@example.com");
    expect(passwordInput).toHaveValue("newpassword");
  });


});
