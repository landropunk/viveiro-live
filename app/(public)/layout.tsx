import { ReactNode } from 'react';

// Force dynamic rendering for all public routes that use client components
// This must be in a server component to take effect during build
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function PublicRouteGroupLayout({ children }: { children: ReactNode }) {
  return children;
}
