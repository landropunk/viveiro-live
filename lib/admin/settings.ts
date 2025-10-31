/**
 * Servicio para gestionar la configuración de la aplicación
 * Solo accesible por administradores
 */

import { createClient } from '@/lib/supabase/server';

export interface AppSetting {
  id: string;
  key: string;
  value: any;
  category: 'sections' | 'features' | 'general';
  label: string;
  description?: string;
  updated_at: string;
  updated_by?: string;
  locked?: boolean; // Indica si el ajuste requiere cambios en el código
}

/**
 * Obtiene toda la configuración de la aplicación
 */
export async function getAllSettings(): Promise<AppSetting[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('app_settings')
    .select('*')
    .order('category', { ascending: true })
    .order('label', { ascending: true });

  if (error) {
    console.error('Error obteniendo configuración:', error);
    throw error;
  }

  return data || [];
}

/**
 * Obtiene configuración por categoría
 */
export async function getSettingsByCategory(
  category: 'sections' | 'features' | 'general'
): Promise<AppSetting[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('app_settings')
    .select('*')
    .eq('category', category)
    .order('label', { ascending: true });

  if (error) {
    console.error(`Error obteniendo configuración de categoría ${category}:`, error);
    throw error;
  }

  return data || [];
}

/**
 * Obtiene un ajuste específico por clave
 */
export async function getSetting(key: string): Promise<AppSetting | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('app_settings')
    .select('*')
    .eq('key', key)
    .single();

  if (error) {
    console.error(`Error obteniendo configuración ${key}:`, error);
    return null;
  }

  return data;
}

/**
 * Actualiza un ajuste específico
 * @param key Clave del ajuste
 * @param value Nuevo valor (puede ser objeto o primitivo)
 */
export async function updateSetting(key: string, value: any): Promise<AppSetting> {
  const supabase = await createClient();

  // Verificar que el usuario es admin
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Usuario no autenticado');
  }

  console.log(`🔍 Usuario intentando actualizar: ${user.email}`);
  console.log(`🔍 user_metadata:`, user.user_metadata);
  console.log(`🔍 raw_user_meta_data:`, (user as any).raw_user_meta_data);

  const { data, error } = await supabase
    .from('app_settings')
    .update({ value })
    .eq('key', key)
    .select()
    .single();

  if (error) {
    console.error(`❌ Error actualizando configuración ${key}:`, error);
    console.error(`❌ Error code:`, error.code);
    console.error(`❌ Error message:`, error.message);
    console.error(`❌ Error details:`, error.details);
    throw error;
  }

  console.log(`✅ Configuración actualizada: ${key} por ${user.email}`);

  return data;
}

/**
 * Verifica si una sección está habilitada
 */
export async function isSectionEnabled(sectionKey: string): Promise<boolean> {
  const setting = await getSetting(`section_${sectionKey}`);
  return setting?.value?.enabled === true;
}

/**
 * Verifica si una característica está habilitada
 */
export async function isFeatureEnabled(featureKey: string): Promise<boolean> {
  const setting = await getSetting(`feature_${featureKey}`);
  return setting?.value?.enabled === true;
}

/**
 * Obtiene un valor de configuración general
 */
export async function getGeneralSetting(settingKey: string): Promise<any> {
  const setting = await getSetting(`general_${settingKey}`);
  return setting?.value?.value ?? setting?.value?.enabled ?? null;
}

/**
 * Obtiene la configuración de secciones del dashboard
 * para construir el menú dinámicamente
 */
export async function getDashboardSectionsConfig(): Promise<
  Record<string, boolean>
> {
  const sections = await getSettingsByCategory('sections');

  const config: Record<string, boolean> = {};
  sections.forEach((section) => {
    // Extraer el nombre de la sección desde la key (ej: "section_meteo" -> "meteo")
    const sectionName = section.key.replace('section_', '');
    config[sectionName] = section.value?.enabled === true;
  });

  return config;
}
