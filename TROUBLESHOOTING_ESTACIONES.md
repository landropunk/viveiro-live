# Troubleshooting - Estaciones Meteorológicas

## Problema: "Error al obtener datos de las estaciones meteorológicas"

### Diagnóstico paso a paso

#### 1. Verificar autenticación

**Abre la consola del navegador (F12) y busca estos mensajes:**

```
[StationsView] Fetching data from /api/protected/stations
[StationsView] Response status: XXX
```

**Posibles estados:**

- **401 Unauthorized**: No estás autenticado o el token ha expirado
  - **Solución**: Cierra sesión y vuelve a iniciar sesión

- **500 Internal Server Error**: Error en el servidor
  - **Solución**: Revisa los logs del servidor (ver sección 3)

- **Error de red**: No se puede conectar al servidor
  - **Solución**: Verifica que el servidor esté corriendo en `http://localhost:3000`

#### 2. Verificar token en localStorage

En la consola del navegador, ejecuta:

```javascript
localStorage.getItem('accessToken')
```

**Deberías ver**: Un token JWT largo (string)

**Si ves `null`**: No estás autenticado
- Navega a `/auth/login` e inicia sesión

#### 3. Revisar logs del servidor

En la terminal donde corre `pnpm dev`, busca estos mensajes:

```
📡 [API /stations] Obteniendo datos de estaciones...
✅ [API /stations] Datos obtenidos: 2 estaciones
```

**Si ves errores**:

```
❌ [API /stations] Error: ...
```

Copia el mensaje de error completo.

#### 4. Probar la API de MeteoGalicia directamente

Ejecuta en una terminal:

```bash
curl "https://servizos.meteogalicia.gal/rss/observacion/ultimos10minEstacionsMeteo.action" | head -50
```

**Deberías ver**: JSON con datos de estaciones

**Si falla**: La API de MeteoGalicia puede estar caída temporalmente

#### 5. Verificar que las rutas API existen

Verifica que estos archivos existan:

- `app/api/protected/stations/route.ts`
- `lib/meteogalicia-stations.ts`
- `components/stations/StationsView.tsx`

#### 6. Revisar middleware

En la consola del servidor, busca:

```
○ Compiling /middleware ...
✓ Compiled /middleware in XXXms
```

Si ves errores de compilación, revisa `middleware.ts`

### Soluciones comunes

#### Problema: "No hay token de autenticación"

**Causa**: No has iniciado sesión o el token se perdió

**Solución**:
1. Ve a `/auth/login`
2. Inicia sesión con tus credenciales
3. Vuelve al dashboard
4. Haz clic en "Estaciones Meteorológicas"

#### Problema: "Sesión expirada"

**Causa**: El token JWT ha expirado (por defecto expira en 15 minutos)

**Solución**:
1. Cierra sesión
2. Vuelve a iniciar sesión
3. Los tokens se refrescarán automáticamente

#### Problema: "Error al obtener datos de estaciones"

**Causa**: Error en la API de MeteoGalicia o en el código del servidor

**Solución**:
1. Revisa los logs del servidor (terminal)
2. Si dice "No se obtuvieron datos de estaciones":
   - La API de MeteoGalicia puede estar temporalmente fuera de servicio
   - Espera unos minutos y haz clic en "Actualizar"
3. Si hay un error de código:
   - Revisa el stack trace en la consola
   - Reporta el error con el stack trace completo

#### Problema: La pestaña "Estaciones Meteorológicas" no aparece

**Causa**: Error de compilación o componente no importado

**Solución**:
1. Detén el servidor (`Ctrl+C`)
2. Ejecuta `pnpm build` para verificar errores de compilación
3. Si hay errores, cópialos y repórtalos
4. Si compila correctamente, ejecuta `pnpm dev` de nuevo

### Logs de depuración

#### En el navegador (Consola DevTools)

Los logs importantes empiezan con `[StationsView]`:

```
[StationsView] Fetching data from /api/protected/stations
[StationsView] Response status: 200
[StationsView] Data received: { observations: 2, comparison: 8 }
```

#### En el servidor (Terminal)

Los logs importantes empiezan con `[API /stations]`:

```
📡 [API /stations] Obteniendo datos de estaciones...
📡 Llamando a API de observaciones MeteoGalicia: https://...
✅ Datos de estaciones recibidos: { total: 2, stations: [...] }
✅ [API /stations] Datos obtenidos: 2 estaciones
```

### Verificar datos manualmente

#### Probar endpoint con autenticación

1. En la consola del navegador, obtén tu token:
   ```javascript
   const token = localStorage.getItem('accessToken');
   console.log(token);
   ```

2. Copia el token

3. En una terminal, ejecuta:
   ```bash
   curl -H "Authorization: Bearer TU_TOKEN_AQUI" http://localhost:3000/api/protected/stations
   ```

**Deberías ver**: JSON con `observations` y `comparison`

### Si nada funciona

1. **Limpia caché del navegador**:
   - Abre DevTools (F12)
   - Pestaña "Network"
   - Haz clic derecho → "Clear browser cache"
   - Recarga la página (Ctrl+R)

2. **Reinicia el servidor**:
   ```bash
   # Detén el servidor con Ctrl+C
   pnpm dev
   ```

3. **Verifica variables de entorno**:
   - Archivo `.env.local` debe existir
   - Debe contener `METEOGALICIA_API_KEY`
   - **NOTA**: La API de estaciones NO requiere API key, pero otras APIs sí

4. **Reinstala dependencias**:
   ```bash
   pnpm install
   ```

5. **Reconstruye el proyecto**:
   ```bash
   pnpm build
   pnpm dev
   ```

### Contacto

Si el problema persiste, proporciona:

1. Mensaje de error completo (consola del navegador)
2. Logs del servidor (terminal)
3. ¿Estás autenticado? (sí/no)
4. ¿Qué ves en la pantalla?
5. Capturas de pantalla si es posible
