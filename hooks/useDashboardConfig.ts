import { useState, useEffect } from 'react';

interface DashboardConfig {
  meteo: boolean;
  historicos: boolean;
  live: boolean;
  webcams: boolean;
  seccion4: boolean;
  seccion5: boolean;
}

/**
 * Hook para cargar la configuración dinámica de las secciones del dashboard
 * desde la base de datos (tabla app_settings)
 */
export function useDashboardConfig() {
  const [config, setConfig] = useState<DashboardConfig>({
    meteo: true,
    historicos: false,
    live: true,
    webcams: true,
    seccion4: false,
    seccion5: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const response = await fetch('/api/dashboard/config');

      if (!response.ok) {
        console.warn('No se pudo cargar configuración, usando valores por defecto');
        setLoading(false);
        return;
      }

      const data = await response.json();
      setConfig(data);
    } catch (error) {
      console.error('Error cargando configuración del dashboard:', error);
      // Mantener valores por defecto en caso de error
    } finally {
      setLoading(false);
    }
  };

  return { config, loading };
}
