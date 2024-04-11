import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Register from "../../components/Register";

describe("Register Component", () => {
  beforeEach(() => {
    render(<Register />);
  });

  test("renders registration form", () => {
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /register/i })
    ).toBeInTheDocument();
  });

  test("allows entering a username, email, and password", () => {
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "newuser" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "newpassword" },
    });

    expect(screen.getByLabelText(/username/i)).toHaveValue("newuser");
    expect(screen.getByLabelText(/email/i)).toHaveValue("user@example.com");
    expect(screen.getByLabelText(/password/i)).toHaveValue("newpassword");
  });

  test("calls register function on form submit", () => {
    const mockRegister = jest.fn();
    render(<Register onRegister={mockRegister} />);

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    expect(mockRegister).toHaveBeenCalled();
  });
});
