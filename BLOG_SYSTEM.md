# Sistema de Blog - viveiro.live

## Descripción

El sistema de blog de viveiro.live permite a los administradores publicar noticias, novedades y contenido editorial sobre Viveiro y sus servicios.

## Características

### Diseño y Presentación

- **Layout apilado vertical**: Los posts se muestran uno debajo del otro en la página principal
- **Tarjetas horizontales**: Imagen a la izquierda (320px), contenido a la derecha en desktop
- **Responsive**: En móviles la imagen aparece arriba y el contenido abajo
- **Ancho completo**: Cada post ocupa todo el ancho disponible del contenedor (max-w-6xl)
- **Título destacado**: "Blog" centrado en text-4xl

### Contenido de Posts

Cada post de blog incluye:
- **Imagen de portada**: Aspecto 16:9, optimizada para web
- **Título**: Hasta 2 líneas visibles
- **Categoría**: Badge con el tipo de contenido (noticias, eventos, etc.)
- **Fecha de publicación**: Formato legible en español
- **Excerpt**: Descripción completa del contenido sin límite de líneas
- **Link "Leer más"**: Con animación en hover

### Animaciones

- **Entrada progresiva**: Los posts aparecen con animación stagger
- **Hover sutil**: Escala 1.01 y elevación de 2px
- **Imagen con zoom**: La imagen hace zoom al pasar el cursor

## Control de Visibilidad

El blog puede activarse/desactivarse desde:
- **Panel de administración**: `/admin/settings`
- **Ajuste**: "Blog / Noticias y Novedades"
- **Efecto**: Oculta completamente la sección del blog en la página principal

## Gestión de Posts

### Crear un Post

1. Acceder a `/admin/blog/new`
2. Completar los campos:
   - Título (requerido)
   - Slug (URL amigable, se genera automáticamente)
   - Categoría (noticias, eventos, etc.)
   - Excerpt (descripción breve)
   - Contenido (editor Markdown)
   - Imagen de portada (URL)
3. Guardar como borrador o publicar

### Editar un Post

1. Acceder a `/admin/blog`
2. Seleccionar el post a editar
3. Modificar los campos necesarios
4. Guardar cambios

### Estados de Posts

- **Borrador**: No visible públicamente
- **Publicado**: Visible en la página principal y en `/blog`

## Base de Datos

### Tabla: `blog_posts`

```sql
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image_url TEXT,
  category TEXT DEFAULT 'general',
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  author_id UUID REFERENCES auth.users(id)
);
```

### Políticas RLS

- **SELECT**: Público puede ver posts publicados
- **INSERT/UPDATE/DELETE**: Solo administradores

## Archivos Principales

### Componentes y Páginas

- `app/(public)/page.tsx` - Página principal con sección de blog
- `app/(admin)/admin/blog/page.tsx` - Lista de posts para admin
- `app/(admin)/admin/blog/new/page.tsx` - Crear nuevo post
- `app/(admin)/admin/blog/[id]/page.tsx` - Editar post existente
- `app/blog/[slug]/page.tsx` - Vista pública de post individual
- `app/blog/page.tsx` - Lista pública de todos los posts

### Servicios y Utilidades

- `lib/admin/blog.ts` - Funciones CRUD para posts
- `app/api/blog/route.ts` - API pública para listar posts
- `app/api/admin/blog/route.ts` - API admin para gestión

## Integración con Ajustes

El blog se integra con el sistema de ajustes de la aplicación:

1. **Clave de configuración**: `feature_blog`
2. **Valor**: `{"enabled": true/false}`
3. **Efecto**:
   - `true`: Muestra sección de blog en página principal
   - `false`: Oculta completamente la sección

## Personalización

### Cambiar el Diseño

Para modificar el layout del blog, editar `app/(public)/page.tsx`:

```typescript
// Layout actual: apilado vertical con tarjetas horizontales
className="flex w-full flex-col gap-6"

// Para grid de 3 columnas (alternativa):
className="grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-3"
```

### Modificar Tamaño de Imagen

En `app/(public)/page.tsx`, línea ~339:

```typescript
// Actual: 320px de ancho
className="... md:w-80"

// Para más ancho:
className="... md:w-96"  // 384px
```

### Cambiar Título de Sección

En `app/(public)/page.tsx`, línea ~319:

```typescript
<h2 className="text-4xl font-bold text-gray-900 dark:text-white">
  Blog
</h2>
```

## Roadmap

Funcionalidades futuras planeadas:

- [ ] Editor Markdown visual (WYSIWYG)
- [ ] Búsqueda de posts
- [ ] Filtrado por categoría
- [ ] Paginación en lista de posts
- [ ] Comentarios en posts
- [ ] Sistema de tags
- [ ] Posts destacados
- [ ] Posts relacionados
- [ ] Compartir en redes sociales
- [ ] Vista previa antes de publicar

## Notas Técnicas

### Formato de Fechas

El formato de fechas se gestiona con la función `formatDate`:

```typescript
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
```

### Orden de Posts

Los posts se ordenan por fecha de publicación descendente (más recientes primero):

```typescript
.order('published_at', { ascending: false })
```

### Límite de Posts en Página Principal

Actualmente se muestran todos los posts publicados. Para limitar:

```typescript
const { data } = await supabase
  .from('blog_posts')
  .select('*')
  .eq('published', true)
  .order('published_at', { ascending: false })
  .limit(3);  // Solo 3 posts más recientes
```

## Troubleshooting

### Los posts no aparecen

1. Verificar que `feature_blog` está habilitado en ajustes
2. Verificar que los posts están marcados como `published: true`
3. Verificar que tienen `published_at` con fecha válida
4. Verificar las políticas RLS en Supabase

### Imágenes no se cargan

1. Verificar que la URL de la imagen es válida y accesible
2. Verificar que la imagen tiene CORS configurado correctamente
3. Considerar usar Supabase Storage para las imágenes

### Error al crear/editar posts

1. Verificar que el usuario es administrador (`role: 'admin'`)
2. Verificar las políticas RLS en la tabla `blog_posts`
3. Revisar logs del navegador y de Supabase

## Soporte

Para más información sobre el sistema de ajustes, ver:
- [ADMIN_SETTINGS.md](./ADMIN_SETTINGS.md) - Sistema de ajustes
- [AJUSTES_FUNCIONAMIENTO.md](./AJUSTES_FUNCIONAMIENTO.md) - Cómo funcionan los ajustes
- [ADMIN_SETUP.md](./ADMIN_SETUP.md) - Configuración de panel admin
