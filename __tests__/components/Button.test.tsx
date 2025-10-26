import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Button from "@/components/Button";

describe("Button", () => {
  it("renders correctly", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("applies primary variant styles by default", () => {
    render(<Button>Primary</Button>);
    const button = screen.getByText("Primary");
    expect(button).toHaveClass("bg-blue-600");
  });

  it("applies secondary variant styles when specified", () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByText("Secondary");
    expect(button).toHaveClass("bg-gray-200");
  });
});
