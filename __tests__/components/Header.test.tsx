import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Header from "@/components/Header";

describe("Header", () => {
  it("renders the logo and brand name", () => {
    render(<Header />);
    expect(screen.getByText("Autonomía")).toBeInTheDocument();
  });

  it("renders navigation links when showNavigation is true", () => {
    render(<Header showNavigation={true} />);
    expect(screen.getByText("Inicio")).toBeInTheDocument();
    expect(screen.getByText("Acerca de")).toBeInTheDocument();
    expect(screen.getByText("Documentación")).toBeInTheDocument();
    expect(screen.getByText("Contacto")).toBeInTheDocument();
  });

  it("does not render navigation when showNavigation is false", () => {
    render(<Header showNavigation={false} />);
    expect(screen.queryByText("Inicio")).not.toBeInTheDocument();
    expect(screen.queryByText("Acerca de")).not.toBeInTheDocument();
  });

  it("renders the CTA button", () => {
    render(<Header />);
    expect(screen.getByText("Comenzar")).toBeInTheDocument();
  });

  it("renders the mobile menu button", () => {
    render(<Header />);
    expect(screen.getByLabelText("Menú")).toBeInTheDocument();
  });
});
