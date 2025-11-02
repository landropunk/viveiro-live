# 🏠 Guía de Instalación de Supabase Self-Hosted

Esta guía te ayudará a instalar Supabase en tu propio servidor privado para **no depender del cloud** de Supabase y tener control total sobre tus datos.

---

## 📋 Tabla de Contenidos

1. [¿Por qué Self-Hosted?](#por-qué-self-hosted)
2. [Requisitos del Servidor](#requisitos-del-servidor)
3. [Instalación con Docker](#instalación-con-docker)
4. [Configuración Inicial](#configuración-inicial)
5. [Migrar Datos desde Supabase Cloud](#migrar-datos-desde-supabase-cloud)
6. [Integración con Viveiro Live](#integración-con-viveiro-live)
7. [Mantenimiento y Backups](#mantenimiento-y-backups)
8. [Troubleshooting](#troubleshooting)

---

## 1. ¿Por qué Self-Hosted?

### Ventajas ✅
- **Privacidad Total**: Tus datos nunca salen de tu servidor
- **Sin Límites de Cuota**: No hay restricciones de almacenamiento o requests
- **Costo Predecible**: Pagas solo por el servidor, sin costos variables
- **Control Completo**: Puedes modificar, tunear y auditar todo
- **GDPR Compliance**: Ideal para cumplir con regulaciones europeas

### Desventajas ❌
- **Mantenimiento Manual**: Tú eres responsable de actualizaciones y backups
- **Complejidad Técnica**: Requiere conocimientos de Docker, Linux y PostgreSQL
- **Disponibilidad**: Debes garantizar uptime y seguridad
- **Sin Soporte Oficial**: No tienes soporte premium de Supabase

### ¿Cuándo elegir Self-Hosted?
- ✅ Tienes un servidor dedicado o VPS
- ✅ Manejas datos sensibles o regulados
- ✅ Quieres reducir costos a largo plazo
- ✅ Necesitas control total sobre la infraestructura
- ❌ No tienes experiencia con servidores Linux
- ❌ Prefieres no preocuparte por el mantenimiento

---

## 2. Requisitos del Servidor

### Especificaciones Mínimas

| Componente | Desarrollo | Producción |
|------------|------------|------------|
| **CPU** | 2 cores | 4+ cores |
| **RAM** | 4 GB | 8+ GB |
| **Disco** | 20 GB SSD | 50+ GB SSD |
| **Ancho de banda** | 1 Mbps | 10+ Mbps |

### Software Necesario
- **Sistema Operativo**: Ubuntu 22.04 LTS o superior (recomendado)
- **Docker**: 20.10+
- **Docker Compose**: 2.0+
- **Git**: Para clonar el repositorio

### Puertos Requeridos
```
3000  - Supabase Studio (interfaz web)
8000  - Kong API Gateway
5432  - PostgreSQL (solo localhost)
8001  - Kong Admin
9000  - MinIO (almacenamiento)
```

---

## 3. Instalación con Docker

### Paso 1: Preparar el Servidor

#### Ubuntu/Debian
```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Agregar usuario al grupo docker
sudo usermod -aG docker $USER

# Cerrar sesión y volver a entrar para aplicar cambios
exit

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verificar instalación
docker --version
docker-compose --version
```

#### CentOS/RHEL/Fedora
```bash
# Instalar Docker
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### Paso 2: Clonar Supabase

```bash
# Crear directorio para Supabase
mkdir -p ~/supabase
cd ~/supabase

# Clonar repositorio oficial
git clone --depth 1 https://github.com/supabase/supabase
cd supabase/docker
```

### Paso 3: Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar configuración
nano .env  # o usa vim, vi, o cualquier editor
```

**Variables críticas a configurar:**

```bash
############################################
# CONFIGURACIÓN DE SUPABASE SELF-HOSTED
############################################

# Dominio público (cambia esto por tu dominio o IP)
SITE_URL=http://tu-dominio.com
# O para desarrollo local:
# SITE_URL=http://192.168.1.100:3000

# URLs de API (cambia el dominio)
API_EXTERNAL_URL=http://tu-dominio.com:8000
SUPABASE_PUBLIC_URL=http://tu-dominio.com:8000

############################################
# SEGURIDAD - GENERA CLAVES ÚNICAS
############################################

# Genera estas claves con:
# openssl rand -base64 32

POSTGRES_PASSWORD=tu_password_postgresql_seguro_aqui
JWT_SECRET=tu_jwt_secret_super_secreto_minimo_32_caracteres
ANON_KEY=generar_con_script_abajo
SERVICE_ROLE_KEY=generar_con_script_abajo

############################################
# SMTP (para envío de emails)
############################################
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu_app_password
SMTP_SENDER_NAME=ViveiroLive
SMTP_ADMIN_EMAIL=admin@viveiro.live

############################################
# ALMACENAMIENTO (MinIO)
############################################
MINIO_ROOT_USER=supabase-storage
MINIO_ROOT_PASSWORD=generar_password_seguro_aqui
```

### Paso 4: Generar Claves JWT

Las claves `ANON_KEY` y `SERVICE_ROLE_KEY` deben ser tokens JWT válidos:

```bash
# Instalar herramienta para generar JWT
npm install -g @supabase/cli

# Generar las claves
supabase gen keys

# O manualmente con este script Node.js
node << 'EOF'
const jwt = require('jsonwebtoken');
const secret = 'TU_JWT_SECRET_AQUI'; // El mismo de arriba

const anonKey = jwt.sign(
  { role: 'anon', iss: 'supabase' },
  secret,
  { expiresIn: '10y' }
);

const serviceKey = jwt.sign(
  { role: 'service_role', iss: 'supabase' },
  secret,
  { expiresIn: '10y' }
);

console.log('ANON_KEY=', anonKey);
console.log('SERVICE_ROLE_KEY=', serviceKey);
EOF
```

Copia las claves generadas y pégalas en tu archivo `.env`.

### Paso 5: Iniciar Supabase

```bash
# Iniciar todos los servicios
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f

# Verificar que todos los contenedores están corriendo
docker-compose ps
```

Deberías ver algo como:

```
NAME                  IMAGE                         STATUS
supabase-db           supabase/postgres             Up 2 minutes
supabase-studio       supabase/studio               Up 2 minutes
supabase-kong         kong:2.8.1                    Up 2 minutes
supabase-auth         supabase/gotrue               Up 2 minutes
supabase-rest         postgrest/postgrest           Up 2 minutes
supabase-realtime     supabase/realtime             Up 2 minutes
supabase-storage      supabase/storage-api          Up 2 minutes
supabase-imgproxy     darthsim/imgproxy             Up 2 minutes
supabase-meta         supabase/postgres-meta        Up 2 minutes
```

### Paso 6: Acceder a Supabase Studio

1. Abre tu navegador
2. Ve a `http://tu-servidor:3000`
3. Inicia sesión con:
   ```
   Email: cualquier_email@ejemplo.com
   Password: cualquier_password
   ```
   (En self-hosted no hay autenticación por defecto en Studio)

---

## 4. Configuración Inicial

### Paso 1: Ejecutar Migración de Viveiro Live

1. En Supabase Studio, ve a **SQL Editor**
2. Copia el contenido de `supabase/migrations/00_INIT_viveiro_live.sql`
3. Pégalo y ejecuta

### Paso 2: Configurar Autenticación

En Supabase Studio:

1. Ve a **Authentication** → **Settings**
2. Configura:
   ```
   Site URL: http://tu-dominio.com
   Redirect URLs: http://tu-dominio.com/**
   ```

### Paso 3: Configurar Almacenamiento

```bash
# Crear bucket para avatares
curl -X POST 'http://localhost:8000/storage/v1/bucket' \
  -H "apikey: TU_ANON_KEY" \
  -H "Authorization: Bearer TU_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name":"avatars","public":true}'
```

---

## 5. Migrar Datos desde Supabase Cloud

Si ya tienes datos en Supabase Cloud:

### Opción 1: Dump Manual

```bash
# En tu PC, exporta desde Supabase Cloud
pg_dump "postgresql://postgres:PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres" \
  -f viveiro_live_dump.sql

# Sube el archivo al servidor
scp viveiro_live_dump.sql usuario@tu-servidor:/tmp/

# En el servidor, importa
docker exec -i supabase-db psql -U postgres postgres < /tmp/viveiro_live_dump.sql
```

### Opción 2: Usando Supabase CLI

```bash
# En tu PC
supabase db dump -f viveiro_live_schema.sql
supabase db dump --data-only -f viveiro_live_data.sql

# Sube archivos al servidor
scp viveiro_live_*.sql usuario@tu-servidor:~/

# En el servidor
supabase db push --db-url "postgresql://postgres:PASSWORD@localhost:5432/postgres"
```

---

## 6. Integración con Viveiro Live

### Actualizar Variables de Entorno

En tu proyecto Next.js, actualiza `.env.local`:

```env
# Supabase Self-Hosted
NEXT_PUBLIC_SUPABASE_URL=http://tu-servidor:8000
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_generada

# Para producción (con dominio y HTTPS)
# NEXT_PUBLIC_SUPABASE_URL=https://api.viveiro.live
# NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_generada
```

### Configurar HTTPS con Nginx (Producción)

```bash
# Instalar Nginx
sudo apt install nginx certbot python3-certbot-nginx -y

# Crear configuración
sudo nano /etc/nginx/sites-available/supabase
```

Contenido:

```nginx
server {
    listen 80;
    server_name api.viveiro.live;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name studio.viveiro.live;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
# Activar configuración
sudo ln -s /etc/nginx/sites-available/supabase /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Obtener certificado SSL
sudo certbot --nginx -d api.viveiro.live -d studio.viveiro.live
```

---

## 7. Mantenimiento y Backups

### Backup Automático de Base de Datos

Crea un script `backup.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/backups/supabase"
DATE=$(date +%Y%m%d_%H%M%S)
FILENAME="viveiro_live_$DATE.sql.gz"

mkdir -p $BACKUP_DIR

# Backup de PostgreSQL
docker exec supabase-db pg_dump -U postgres postgres | gzip > "$BACKUP_DIR/$FILENAME"

# Mantener solo los últimos 30 días
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

echo "Backup completado: $FILENAME"
```

```bash
# Hacer ejecutable
chmod +x backup.sh

# Programar con cron (diario a las 2 AM)
crontab -e
# Agregar:
0 2 * * * /ruta/al/backup.sh
```

### Actualizar Supabase

```bash
cd ~/supabase/docker

# Detener servicios
docker-compose down

# Actualizar código
git pull origin master

# Reconstruir imágenes
docker-compose pull

# Iniciar
docker-compose up -d
```

### Monitoreo

```bash
# Ver uso de recursos
docker stats

# Ver logs de un servicio específico
docker-compose logs -f supabase-db

# Verificar salud de PostgreSQL
docker exec supabase-db pg_isready
```

---

## 8. Troubleshooting

### Los contenedores no inician

```bash
# Ver logs detallados
docker-compose logs

# Verificar espacio en disco
df -h

# Verificar memoria
free -h

# Reiniciar todo
docker-compose down
docker-compose up -d
```

### Error: "Connection refused"

**Causa:** El servicio no está escuchando en el puerto esperado.

**Solución:**
```bash
# Verificar puertos
sudo netstat -tulpn | grep -E '3000|8000|5432'

# Verificar firewall
sudo ufw status
sudo ufw allow 3000
sudo ufw allow 8000
```

### PostgreSQL no acepta conexiones

```bash
# Verificar que PostgreSQL está corriendo
docker exec supabase-db psql -U postgres -c "SELECT version();"

# Verificar logs
docker-compose logs supabase-db
```

### Falta de RAM

```bash
# Agregar swap (si tienes menos de 8GB RAM)
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Hacer permanente
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

---

## 📚 Recursos Adicionales

- [Documentación oficial de Supabase Self-Hosting](https://supabase.com/docs/guides/self-hosting)
- [Repositorio Docker de Supabase](https://github.com/supabase/supabase/tree/master/docker)
- [Comunidad en Discord](https://discord.supabase.com/)
- [Stack Overflow - Supabase](https://stackoverflow.com/questions/tagged/supabase)

---

## ✅ Checklist Final

Antes de poner en producción:

- [ ] Servidor con especificaciones mínimas cumplidas
- [ ] Docker y Docker Compose instalados
- [ ] Variables de entorno configuradas con claves únicas
- [ ] Todos los contenedores corriendo sin errores
- [ ] Migración de Viveiro Live ejecutada
- [ ] Backup automático configurado
- [ ] Firewall configurado correctamente
- [ ] HTTPS configurado con certificado válido (producción)
- [ ] Monitoreo de recursos configurado
- [ ] Plan de recuperación ante desastres documentado

---

**Anterior:** [Guía de Integración de Supabase](SUPABASE_INTEGRATION_GUIDE.md)
**Siguiente:** [Configuración OAuth](oauth/OAUTH_SETUP.md)
