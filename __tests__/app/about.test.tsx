import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import AboutPage from "@/app/about/page";

describe("About Page", () => {
  it("renders the page title", () => {
    render(<AboutPage />);
    expect(screen.getByText("Acerca del Proyecto")).toBeInTheDocument();
  });

  it("renders the mission section", () => {
    render(<AboutPage />);
    expect(screen.getByText("Nuestra Misión")).toBeInTheDocument();
    expect(
      screen.getByText(/Proporcionar una base sólida/i)
    ).toBeInTheDocument();
  });

  it("renders the technology stack section", () => {
    render(<AboutPage />);
    expect(screen.getByText("Stack Tecnológico")).toBeInTheDocument();
    expect(screen.getByText("Frontend")).toBeInTheDocument();
    expect(screen.getByText("Herramientas")).toBeInTheDocument();
  });

  it("displays all frontend technologies", () => {
    render(<AboutPage />);
    expect(screen.getByText(/Next.js 14 con App Router/i)).toBeInTheDocument();
    expect(screen.getByText(/React 18.3/i)).toBeInTheDocument();
    expect(screen.getByText(/TypeScript 5.9/i)).toBeInTheDocument();
    expect(screen.getByText(/Tailwind CSS 3.4/i)).toBeInTheDocument();
  });

  it("displays all tools", () => {
    render(<AboutPage />);
    expect(screen.getByText(/Vitest 3.2 para testing/i)).toBeInTheDocument();
    expect(screen.getByText(/ESLint 9 para linting/i)).toBeInTheDocument();
    expect(
      screen.getByText(/pnpm para gestión de paquetes/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Vercel para deployment/i)).toBeInTheDocument();
  });

  it("renders the features section", () => {
    render(<AboutPage />);
    expect(screen.getByText("Características Principales")).toBeInTheDocument();
    expect(screen.getByText("TypeScript Estricto")).toBeInTheDocument();
    expect(screen.getByText("Testing Integrado")).toBeInTheDocument();
    expect(screen.getByText("Diseño Responsivo")).toBeInTheDocument();
    expect(screen.getByText("Optimización Automática")).toBeInTheDocument();
  });

  it("renders CTA section with buttons", () => {
    render(<AboutPage />);
    expect(screen.getByText("¿Listo para comenzar?")).toBeInTheDocument();
    expect(screen.getByText("Volver al Inicio")).toBeInTheDocument();
    expect(screen.getByText("Ver Documentación")).toBeInTheDocument();
  });

  it("has correct link to home page", () => {
    render(<AboutPage />);
    const homeLink = screen.getByText("Volver al Inicio");
    expect(homeLink.closest("a")).toHaveAttribute("href", "/");
  });

  it("has correct external link to Next.js docs", () => {
    render(<AboutPage />);
    const docsLink = screen.getByText("Ver Documentación");
    expect(docsLink.closest("a")).toHaveAttribute(
      "href",
      "https://nextjs.org/docs"
    );
    expect(docsLink.closest("a")).toHaveAttribute("target", "_blank");
    expect(docsLink.closest("a")).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders the header component", () => {
    render(<AboutPage />);
    expect(screen.getByText("Autonomía")).toBeInTheDocument();
  });
});
