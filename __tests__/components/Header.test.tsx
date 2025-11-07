import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Header from "@/components/Header";
import { AuthProvider } from "@/contexts/AuthContext";

// Mock del router de Next.js
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/',
}));

// Helper para renderizar con AuthProvider
const renderWithAuth = (component: React.ReactElement) => {
  return render(<AuthProvider>{component}</AuthProvider>);
};

describe("Header", () => {
  it("renders the header component", () => {
    renderWithAuth(<Header />);
    // Verificar que el header se renderiza correctamente
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    renderWithAuth(<Header />);
    // Buscar link "Dashboard" que existe en Header actual
    const dashboardLink = screen.queryByText("Dashboard");
    expect(dashboardLink).toBeInTheDocument();
  });

  it("renders authentication buttons when not logged in", () => {
    renderWithAuth(<Header />);
    // Verificar botones de login/registro
    const loginButton = screen.queryByText(/Iniciar Sesión/i);
    expect(loginButton).toBeInTheDocument();
  });
});
