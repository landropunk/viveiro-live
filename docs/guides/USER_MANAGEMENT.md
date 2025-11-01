# Sistema de Gestión de Usuarios - viveiro.live

## Descripción

Sistema completo de administración de usuarios que permite a los administradores gestionar todos los usuarios registrados en la plataforma, incluyendo edición de perfiles, cambio de roles y activación/desactivación de cuentas.

## Características

### Panel de Administración de Usuarios

**URL**: `/admin/users`

- **Lista completa de usuarios** con información resumida
- **Filtros avanzados**:
  - Por rol (Todos, Usuarios, Administradores)
  - Por estado (Todos, Activos, Inactivos)
  - Búsqueda por email o nombre
- **Estadísticas en tiempo real**:
  - Total de usuarios
  - Usuarios activos
  - Administradores
- **Tabla responsive** con información clave
- **Acceso directo** a edición de cada usuario

### Edición de Usuario Individual

**URL**: `/admin/users/[id]`

Formulario completo con los siguientes campos:

#### Información Básica
- **Email**: Solo lectura, no editable
- **Nombre completo**: Texto libre
- **Teléfono**: Formato libre
- **Biografía**: Área de texto para descripción personal

#### Dirección
- **Dirección**: Calle y número
- **Ciudad**: Por defecto "Viveiro"
- **Código Postal**: Formato libre

#### Información Adicional
- **Fecha de nacimiento**: Selector de fecha
- **Avatar URL**: URL de imagen de perfil

#### Configuración de Cuenta
- **Rol**: Usuario normal o Administrador
- **Estado**: Activo/Inactivo (toggle switch)

### Seguridad

- **Protección de auto-degradación**: Un administrador no puede quitarse a sí mismo el rol de admin
- **Row Level Security (RLS)**: Políticas de seguridad a nivel de base de datos
- **Autenticación requerida**: Todas las operaciones requieren estar autenticado
- **Solo administradores**: Verificación de rol en cada petición

## Base de Datos

### Tabla: `user_profiles`

```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  address TEXT,
  city TEXT DEFAULT 'Viveiro',
  postal_code TEXT,
  birth_date DATE,
  bio TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Índices

- `user_profiles_email_idx`: Búsqueda rápida por email
- `user_profiles_role_idx`: Filtrado por rol

### Triggers Automáticos

**1. Creación automática de perfil**
- Se dispara cuando un nuevo usuario se registra
- Crea automáticamente un perfil en `user_profiles`
- Asigna el rol desde `raw_user_meta_data` o 'user' por defecto

**2. Actualización de timestamp**
- Actualiza `updated_at` automáticamente en cada modificación

### Políticas RLS

**Usuarios normales:**
- Pueden ver su propio perfil
- Pueden actualizar su propio perfil (excepto el campo `role`)

**Administradores:**
- Pueden ver todos los perfiles
- Pueden actualizar cualquier perfil
- Pueden activar/desactivar usuarios

## Archivos del Sistema

### Backend

**Servicios**:
- `lib/admin/users.ts` - Funciones CRUD para usuarios
  - `getAllUserProfiles()` - Lista todos los usuarios
  - `getUserProfileById(userId)` - Obtiene un usuario específico
  - `updateUserProfile(userId, data)` - Actualiza perfil
  - `deactivateUser(userId)` - Desactiva usuario (soft delete)
  - `activateUser(userId)` - Activa usuario
  - `changeUserRole(userId, newRole)` - Cambia rol
  - `getUserStats()` - Obtiene estadísticas

**API Routes**:
- `app/api/admin/users/route.ts`
  - `GET` - Obtiene todos los usuarios (solo admins)
  - `PATCH` - Actualiza un usuario (solo admins)

### Frontend

**Páginas**:
- `app/(admin)/admin/users/page.tsx` - Lista de usuarios
- `app/(admin)/admin/users/[id]/page.tsx` - Edición de usuario

**Layout**:
- `app/(admin)/admin/layout.tsx` - Menú actualizado con enlace a Usuarios

### Base de Datos

**Migraciones**:
- `supabase/migrations/20250131_user_profiles.sql` - Creación completa del sistema

## Uso

### Acceder al Panel de Usuarios

1. Iniciar sesión como administrador
2. Ir a `/admin/users`
3. Ver lista de todos los usuarios

### Editar un Usuario

1. En la lista de usuarios, clic en "Editar"
2. Modificar los campos deseados
3. Clic en "Guardar Cambios"
4. Confirmación de éxito

### Filtrar Usuarios

**Por rol:**
- Seleccionar "Todos", "Usuarios" o "Administradores" en el filtro de rol

**Por estado:**
- Seleccionar "Todos", "Activos" o "Inactivos" en el filtro de estado

**Por búsqueda:**
- Escribir en el campo de búsqueda (busca en email y nombre)

### Cambiar Rol de Usuario

1. Editar usuario
2. En "Configuración de Cuenta", cambiar el selector de Rol
3. Guardar cambios

**Nota**: No puedes quitarte a ti mismo el rol de administrador

### Desactivar un Usuario

1. Editar usuario
2. En "Configuración de Cuenta", desactivar el toggle "Usuario Activo"
3. Guardar cambios

El usuario no podrá iniciar sesión mientras esté inactivo.

## Estadísticas

El panel muestra en tiempo real:

- **Total Usuarios**: Cantidad total de usuarios registrados
- **Usuarios Activos**: Usuarios con cuenta activa
- **Administradores**: Usuarios con rol de admin

## Validaciones

### Lado del Cliente

- Email es solo lectura (no editable)
- Todos los campos son opcionales excepto el email
- Fecha de nacimiento usa selector de fecha nativo

### Lado del Servidor

- Verificación de autenticación en cada petición
- Verificación de rol de administrador
- Protección contra auto-degradación de admin
- Validación de UUID de usuario

## Seguridad y Permisos

### Políticas de Acceso

| Acción | Usuario Normal | Administrador |
|--------|---------------|---------------|
| Ver propio perfil | ✅ | ✅ |
| Editar propio perfil | ✅ (sin cambiar rol) | ✅ |
| Ver otros perfiles | ❌ | ✅ |
| Editar otros perfiles | ❌ | ✅ |
| Cambiar roles | ❌ | ✅ |
| Activar/desactivar usuarios | ❌ | ✅ |

### Protecciones Implementadas

1. **Row Level Security (RLS)**: Políticas a nivel de base de datos
2. **Verificación en API**: Doble verificación en cada endpoint
3. **Auto-protección**: Un admin no puede degradarse a sí mismo
4. **Cascade Delete**: Al eliminar un usuario de auth, se elimina automáticamente su perfil

## Migraciones Existentes

Los perfiles se crean automáticamente para:
- Nuevos usuarios al registrarse (trigger automático)
- Usuarios existentes (migración ejecutada al crear la tabla)

## Extensiones Futuras

Funcionalidades planeadas:

- [ ] Eliminar usuarios permanentemente
- [ ] Historial de cambios de perfil
- [ ] Exportar lista de usuarios (CSV/Excel)
- [ ] Envío de emails a usuarios
- [ ] Reset de contraseña desde admin
- [ ] Subida de avatar desde formulario
- [ ] Validación de teléfono y código postal
- [ ] Campos personalizados adicionales
- [ ] Grupos de usuarios
- [ ] Permisos granulares

## Troubleshooting

### Los usuarios no aparecen en la lista

1. Verificar que estás autenticado como administrador
2. Verificar las políticas RLS en Supabase
3. Revisar logs del navegador
4. Verificar que la tabla `user_profiles` existe

### No puedo editar un usuario

1. Verificar que eres administrador
2. Verificar que el usuario existe
3. Revisar errores en consola del navegador
4. Verificar permisos de la API

### Error "No puedes quitarte a ti mismo el rol de administrador"

Esto es una protección de seguridad. Para cambiarte de rol:
1. Crea otro administrador primero
2. Pide al otro administrador que te cambie el rol
3. O cambia el rol directamente en Supabase SQL Editor

### Los perfiles no se crean automáticamente

1. Verificar que el trigger `on_auth_user_created` existe
2. Ejecutar manualmente la migración
3. Crear perfiles para usuarios existentes:

```sql
INSERT INTO user_profiles (id, email, role)
SELECT
  id,
  email,
  COALESCE(raw_user_meta_data->>'role', 'user') as role
FROM auth.users
ON CONFLICT (id) DO NOTHING;
```

## Relacionado

- [ADMIN_SETTINGS.md](./ADMIN_SETTINGS.md) - Sistema de ajustes
- [ADMIN_SETUP.md](./ADMIN_SETUP.md) - Configuración del panel admin
- [BLOG_SYSTEM.md](./BLOG_SYSTEM.md) - Sistema de blog
