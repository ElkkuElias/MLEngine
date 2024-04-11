import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import Dropdown from "../../components/dropdown";

describe("Dropdown Component", () => {
  const mockOnLanguageSelect = jest.fn();

  beforeEach(() => {
    render(<Dropdown onLanguageSelect={mockOnLanguageSelect} />);
  });

  test("renders without crashing", () => {
    expect(screen.getByRole("button", { name: "English" })).toBeInTheDocument();
  });

  test("initial selected language is English", () => {
    expect(screen.getByRole("button", { name: "English" })).toBeInTheDocument();
  });

  test("clicking toggle button shows dropdown menu", () => {
    fireEvent.click(screen.getByRole("button", { name: "English" }));
    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Finnish" })).toBeInTheDocument();
  });

  test("selecting a different language updates component and calls onLanguageSelect", () => {
    fireEvent.click(screen.getByRole("button", { name: "English" })); // Open dropdown
    fireEvent.click(screen.getByRole("button", { name: "Finnish" })); // Select Finnish
    expect(mockOnLanguageSelect).toHaveBeenCalledWith("su");
    expect(screen.getByRole("button", { name: "Finnish" })).toBeInTheDocument();
  });

  test("font size adjusts for Telugu language", () => {
    fireEvent.click(screen.getByRole("button", { name: "English" })); // Open dropdown
    fireEvent.click(screen.getByRole("button", { name: "Telugu" })); // Select Telugu
    const dropdown = screen.getByRole("button", { name: "Telugu" }).parentNode;
    expect(dropdown).toHaveStyle("fontSize: 16px");
  });
});
