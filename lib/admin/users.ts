import { createClient } from '@/lib/supabase/server';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  birth_date?: string;
  bio?: string;
  avatar_url?: string;
  role: 'user' | 'admin';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UpdateUserProfileData {
  full_name?: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  birth_date?: string;
  bio?: string;
  avatar_url?: string;
  role?: 'user' | 'admin';
  is_active?: boolean;
}

/**
 * Obtiene todos los perfiles de usuario
 */
export async function getAllUserProfiles(): Promise<UserProfile[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error obteniendo perfiles:', error);
    throw new Error(`Error al obtener perfiles de usuario: ${error.message}`);
  }

  return data || [];
}

/**
 * Obtiene un perfil de usuario por ID
 */
export async function getUserProfileById(userId: string): Promise<UserProfile | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error obteniendo perfil:', error);
    throw new Error(`Error al obtener perfil: ${error.message}`);
  }

  return data;
}

/**
 * Actualiza un perfil de usuario
 */
export async function updateUserProfile(
  userId: string,
  data: UpdateUserProfileData
): Promise<UserProfile> {
  const supabase = await createClient();

  const { data: updated, error } = await supabase
    .from('user_profiles')
    .update(data)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error actualizando perfil:', error);
    throw new Error(`Error al actualizar perfil: ${error.message}`);
  }

  return updated;
}

/**
 * Desactiva un usuario (soft delete)
 */
export async function deactivateUser(userId: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('user_profiles')
    .update({ is_active: false })
    .eq('id', userId);

  if (error) {
    console.error('Error desactivando usuario:', error);
    throw new Error(`Error al desactivar usuario: ${error.message}`);
  }
}

/**
 * Activa un usuario
 */
export async function activateUser(userId: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('user_profiles')
    .update({ is_active: true })
    .eq('id', userId);

  if (error) {
    console.error('Error activando usuario:', error);
    throw new Error(`Error al activar usuario: ${error.message}`);
  }
}

/**
 * Cambia el rol de un usuario
 */
export async function changeUserRole(
  userId: string,
  newRole: 'user' | 'admin'
): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('user_profiles')
    .update({ role: newRole })
    .eq('id', userId);

  if (error) {
    console.error('Error cambiando rol:', error);
    throw new Error(`Error al cambiar rol de usuario: ${error.message}`);
  }
}

/**
 * Obtiene estadísticas de usuarios
 */
export async function getUserStats() {
  const supabase = await createClient();

  const { data: profiles } = await supabase
    .from('user_profiles')
    .select('role, is_active');

  if (!profiles) {
    return { total: 0, active: 0, inactive: 0, admins: 0, users: 0 };
  }

  return {
    total: profiles.length,
    active: profiles.filter((p) => p.is_active).length,
    inactive: profiles.filter((p) => !p.is_active).length,
    admins: profiles.filter((p) => p.role === 'admin').length,
    users: profiles.filter((p) => p.role === 'user').length,
  };
}
