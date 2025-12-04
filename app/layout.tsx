import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { CookieConsentManager } from "@/components/cookies/CookieConsentManager";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ViveiroLive",
  description: "Tu portal de Viveiro - Meteorología en tiempo real, contenido en directo, webcams y más servicios de Viveiro (Lugo, España)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="bg-gray-50 dark:bg-gray-900">
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-900`} style={{ backgroundColor: '#f9fafb' }}>
        <AuthProvider>{children}</AuthProvider>
        <CookieConsentManager />
      </body>
    </html>
  );
}
