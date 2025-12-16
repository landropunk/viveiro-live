import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { logger } from '@/lib/logger';

/**
 * Hook para obtener el nombre dinámico del sitio desde la base de datos
 *
 * NOTA: Esta funcionalidad está DESACTIVADA por defecto.
 * Para activarla, debes:
 * 1. Ejecutar la migración SQL que desbloquea general_site_name
 * 2. Descomentar el uso de este hook en los componentes
 *
 * @returns {Object} { siteName: string, loading: boolean }
 */
export function useSiteName() {
  const [siteName, setSiteName] = useState('viveiro.live');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSiteName();
  }, []);

  const loadSiteName = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      const { data } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'general_site_name')
        .single();

      if (data && data.value?.value) {
        setSiteName(data.value.value);
      }
    } catch (error) {
      logger.error('Error loading site name:', error);
      // Mantener valor por defecto en caso de error
    } finally {
      setLoading(false);
    }
  };

  return { siteName, loading };
}
