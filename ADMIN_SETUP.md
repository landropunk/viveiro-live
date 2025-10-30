# Sistema de Administración de viveiro.live

## ✅ Lo que se ha implementado

### 1. Estructura de Base de Datos
Se ha creado el archivo de migración SQL con todas las tablas necesarias:
- **`blog_posts`**: Para artículos y noticias
- **`webcams`**: Para gestionar cámaras web
- **`live_content`**: Para contenido de YouTube (directos y videos)
- **Políticas RLS**: Seguridad a nivel de fila (solo admins pueden editar)
- **Triggers**: Actualización automática de timestamps

### 2. Protección de Rutas
- Middleware actualizado para proteger `/admin/*`
- Solo usuarios con `role: 'admin'` pueden acceder
- Hook `useIsAdmin()` para verificar permisos en cliente

### 3. Panel de Administración
**Ruta**: `/admin`
- Layout con sidebar dedicado para administración
- Navegación entre secciones admin
- Enlace de acceso rápido desde "Mi Espacio" (solo visible para admins)

### 4. Gestión de Blog/Noticias ✅ COMPLETO
**Rutas**:
- `/admin/blog` - Lista de posts
- `/admin/blog/new` - Crear nuevo post
- `/admin/blog/edit/[id]` - Editar post existente

**Funcionalidades**:
- Crear, editar y eliminar posts
- Sistema de categorías y etiquetas
- Publicar/despublicar posts
- Generación automática de slug desde título
- Editor de contenido con soporte Markdown
- Imágenes de portada
- Extracto para vista previa

### 5. Mostrar Blog en Inicio ✅
- La página de inicio ahora muestra los últimos 3 posts publicados
- Sección "Noticias y Novedades" con animaciones
- Solo se muestran posts publicados

---

## 🚀 PASOS PARA ACTIVAR EL SISTEMA

### Paso 1: Ejecutar la Migración SQL

1. Abre tu dashboard de Supabase: https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a **SQL Editor** en el menú lateral
4. Copia **TODO** el contenido del archivo:
   ```
   supabase/migrations/admin_system.sql
   ```
5. Pégalo en el editor SQL y haz clic en **RUN**
6. Verifica que no haya errores

### Paso 2: Convertir tu Usuario en Administrador

En el mismo **SQL Editor**, ejecuta este comando (reemplaza el email):

```sql
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'TU-EMAIL@EJEMPLO.COM';
```

**IMPORTANTE**: Reemplaza `'TU-EMAIL@EJEMPLO.COM'` con tu email real.

### Paso 3: Cerrar Sesión y Volver a Entrar

1. Cierra sesión en viveiro.live
2. Vuelve a iniciar sesión
3. Ahora deberías ver un enlace "⚙️ Panel Admin" en el sidebar de "Mi Espacio"

---

## 📝 CÓMO USAR EL BLOG

### Crear un Post

1. Ve a `/admin` o haz clic en "⚙️ Panel Admin"
2. Haz clic en "Blog / Noticias"
3. Clic en "Nuevo Post"
4. Rellena los campos:
   - **Título**: El título del artículo
   - **Slug**: Se genera automáticamente (puedes editarlo)
   - **Extracto**: Resumen breve (opcional pero recomendado)
   - **Contenido**: El texto completo (soporta Markdown)
   - **Imagen de Portada**: URL de una imagen (opcional)
   - **Categoría**: General, Noticias, Eventos, Cultura, Turismo
   - **Etiquetas**: Palabras clave separadas (ej: "fiesta", "cultura")
   - **Publicar**: Marca el checkbox para publicar inmediatamente
5. Haz clic en "Crear Post"

### El Post Aparecerá

- En la **lista de admin**: `/admin/blog`
- En la **página de inicio**: Solo si está publicado (últimos 3 posts)

---

## 📋 PENDIENTE DE IMPLEMENTAR

### Webcams (próximamente)
- `/admin/webcams` - Gestión de cámaras
- Añadir/editar/eliminar webcams
- URLs de streams
- Orden de visualización

### Live/Play (próximamente)
- `/admin/live-content` - Gestión de contenido YouTube
- Videos grabados y directos
- Programación de eventos
- Estados: programado, en vivo, finalizado

### Usuarios (próximamente)
- `/admin/users` - Gestión de usuarios
- Ver lista de usuarios registrados
- Asignar/quitar rol de admin
- Estadísticas de uso

---

## 🎨 Categorías de Blog Disponibles

- **general**: Contenido variado
- **noticias**: Noticias locales
- **eventos**: Eventos y actividades
- **cultura**: Cultura y tradiciones
- **turismo**: Información turística

Puedes añadir más editando el componente `BlogPostForm.tsx` línea 184.

---

## 🔧 Archivos Principales Creados

### Base de datos
- `supabase/migrations/admin_system.sql` - Schema completo

### Hooks
- `hooks/useIsAdmin.ts` - Verificar permisos de admin

### Layouts
- `app/(admin)/admin/layout.tsx` - Layout del panel admin

### Páginas Admin
- `app/(admin)/admin/page.tsx` - Dashboard principal
- `app/(admin)/admin/blog/page.tsx` - Lista de posts
- `app/(admin)/admin/blog/new/page.tsx` - Crear post
- `app/(admin)/admin/blog/edit/[id]/page.tsx` - Editar post

### Componentes
- `components/admin/BlogPostForm.tsx` - Formulario de posts

### Utilidades
- `lib/admin/blog.ts` - Funciones CRUD para blog

### Actualizado
- `lib/supabase/middleware.ts` - Protección de rutas admin
- `app/(protected)/dashboard/layout.tsx` - Enlace a panel admin
- `app/(public)/page.tsx` - Mostrar posts en inicio

---

## 🐛 Troubleshooting

### No veo el enlace "Panel Admin"
- Verifica que ejecutaste el UPDATE en la base de datos
- Cierra sesión completamente y vuelve a entrar
- Comprueba en Supabase que tu usuario tiene `role: 'admin'` en metadata

### Me redirige al dashboard cuando intento entrar a /admin
- Tu usuario no tiene permisos de admin
- Ejecuta nuevamente el comando UPDATE en SQL Editor

### Los posts no aparecen en inicio
- Verifica que el post esté marcado como "Publicado"
- Comprueba la fecha de publicación
- Mira la consola del navegador por errores

---

## 📞 Próximos Pasos

Una vez que hayas probado el blog, podemos continuar con:

1. **Webcams**: Sistema completo de gestión de cámaras
2. **Live/Play**: Gestión de videos y directos de YouTube
3. **Usuarios**: Panel de administración de usuarios

¡El sistema está listo para usar! 🎉
