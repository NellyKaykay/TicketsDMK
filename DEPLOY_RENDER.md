# Despliegue en Render para TicketsDMK

Este documento describe los pasos recomendados para desplegar la aplicación en Render, aprovechando la configuración inicial en `render.yaml`.

Resumen rápido
- El proyecto usa SvelteKit con `@sveltejs/adapter-node` (server-side).
- Importante: durante el build necesitamos que `devDependencies` (Tailwind/PostCSS) estén instaladas. En `render.yaml` se ha ajustado el comando de build a `NPM_CONFIG_PRODUCTION=false npm ci && npm run build` para forzar la instalación de `devDependencies` en la fase de build. El servicio se arranca con `npm start`.

1) Conectar repositorio
- En Render, crea un nuevo Web Service y conecta tu repo Git (GitHub/GitLab/Bitbucket).

2) Configuración del servicio (render.yaml ya contiene una base)
- `type: web`, `runtime: node`, `buildCommand: npm ci && npm run build`, `startCommand: npm start`.
- `healthCheckPath` puede apuntar a `/` o a un endpoint de estado si lo añades (recomendado: `/api/health`).

3) Variables de entorno y secretos
- No pongas claves en el repositorio. Usa los Secrets/Environment en Render Dashboard o `envVars.fromDatabase` como ya aparece para `DATABASE_URL`.
- Añadir/actualizar en Render:
  - `NODE_ENV=production`
  - `ORIGIN=https://www.ticketsdmk.com`
  - `PUBLIC_API_URL=https://api.ticketsdmk.com`
  - `ANTHROPIC_API_KEY` (secret)
  - `ANTHROPIC_MODEL=claude-sonnet-4.5`
  - `ENABLE_CLAUDE_SONNET=true`
  - `STRIPE_SECRET_KEY` (secret)
  - `JWT_SECRET` (puede generarse en Render o provenir de un secret manager)
  - `EMAIL_USER`, `EMAIL_PASS` (secret)

4) Puerto
- Render inyecta `PORT`; asegúrate de que la app escuche `process.env.PORT` (SvelteKit + adapter-node ya lo soporta). En `render.yaml` está `PORT=10000` como ejemplo; Render sobrescribe con su puerto asignado.

5) CORS / Origen
- Configurar en la app o en middlewares CORS que permitan `https://www.ticketsdmk.com` y `https://api.ticketsdmk.com` según corresponda.

6) Protecciones y límites
- Usar autenticación (ya integrado con Supabase en el proyecto). Asegura endpoints de IA con `Authorization: Bearer <token>`.
- Añadir rate limiting y logging para controlar costes de Anthropic.

7) Monitorización y salud
- Añadir un endpoint `/api/health` simple que devuelva 200. Configura `healthCheckPath` a ese endpoint en `render.yaml`.

8) Despliegue y verificación
- Push a la rama configurada; Render ejecutará build y start.
- Verifica logs para errores y verifica que `ANTHROPIC_API_KEY` esté presente en el entorno (prueba con un prompt corto y usuario de prueba).

9) Rollback
- Si detectas problemas en producción, desactiva la flag `ENABLE_CLAUDE_SONNET=false` y/o rollback a la versión anterior desde el dashboard de Render.

Notas adicionales
- `render.yaml` ya incluye `DATABASE_URL` desde la base de datos (`ticketsdmk-db`). Ajusta los planes y nombre si cambias de entorno.
- Recomendación: habilitar TLS/Custom Domain en Render para `www.ticketsdmk.com` y `api.ticketsdmk.com` y apuntar DNS.

Comandos útiles localmente
```
# instalar deps
npm ci

# construir
npm run build

# iniciar (modo producción)
npm start
```

¿Quieres que:
- A: Añada un endpoint `/api/health` y lo configure en `render.yaml` (lo hago), o
- B: Generar una versión actualizada de `render.yaml` con `ANTHROPIC` envVars marcados como `sync: false` para que Render los pida en el dashboard?
# TicketsDMK - Despliegue en Render

## 🚀 Guía de Despliegue

### 1. Preparación del Repositorio

El proyecto ya está configurado para Render con:
- ✅ Adaptador Node.js (`@sveltejs/adapter-node`)
- ✅ Scripts de build y start
- ✅ Configuración `render.yaml`
- ✅ Variables de entorno configuradas

### 2. Crear Cuenta en Render

1. Ve a [render.com](https://render.com)
2. Regístrate con tu cuenta de GitHub
3. Conecta tu repositorio `TicketsDMK`

### 3. Configuración en Render

#### Opción A: Usar render.yaml (Recomendado)
1. En el dashboard de Render, selecciona "Blueprint"
2. Conecta tu repositorio GitHub
3. Render detectará automáticamente el archivo `render.yaml`
4. Configurará tanto el servicio web como la base de datos PostgreSQL

#### Opción B: Configuración Manual
1. Crear Web Service:
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

2. Crear PostgreSQL Database:
   - **Name**: `ticketsdmk-db`
   - **Plan**: Free

### 4. Configurar Variables de Entorno

En el panel de tu Web Service, agrega estas variables:

```bash
NODE_ENV=production
DATABASE_URL=[Se configura automáticamente desde la base de datos]
JWT_SECRET=[Render puede generar uno automáticamente]
STRIPE_SECRET_KEY=sk_live_tu_clave_stripe
STRIPE_PUBLISHABLE_KEY=pk_live_tu_clave_stripe
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=tu-password-de-aplicacion
ORIGIN=https://tu-dominio.onrender.com
```

### 5. Configurar Dominio Personalizado

1. En tu servicio, ve a "Settings" → "Custom Domains"
2. Agrega `ticketsdmk.com`
3. Configura los registros DNS en tu proveedor:

**Para dominio apex (ticketsdmk.com):**
```
CNAME    ticketsdmk.com    tu-servicio.onrender.com
```

**Para subdominio (www.ticketsdmk.com):**
```
CNAME    www.ticketsdmk.com    tu-servicio.onrender.com
```

### 6. Próximos Pasos - Funcionalidades de Venta

Después del despliegue, necesitarás implementar:

#### Base de Datos
- Tablas para usuarios, eventos, entradas, transacciones
- Sistema de autenticación
- Gestión de sesiones

#### Pagos
- Integración completa con Stripe
- Webhook para confirmaciones de pago
- Generación de tickets

#### Emails
- Confirmaciones de compra
- Tickets por email
- Notificaciones

#### Panel de Administración
- Gestión de eventos
- Ventas y estadísticas
- Control de entradas

## 📋 Comandos Útiles

```bash
# Desarrollo local
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Inicio en producción
npm start
```

## 🔧 Estructura del Proyecto

```
ticketsdmk/
├── src/
│   ├── routes/          # Páginas de la aplicación
│   ├── lib/             # Componentes y utilidades
│   └── app.html         # Template principal
├── static/              # Archivos estáticos
├── render.yaml          # Configuración de Render
├── .env.example         # Variables de entorno de ejemplo
└── package.json         # Dependencias y scripts
```

## ⚡ Características de Render

- **SSL automático** para tu dominio personalizado
- **Auto-deploy** desde GitHub (push to deploy)
- **PostgreSQL gratuito** hasta 1GB
- **Monitoreo** y logs integrados
- **Escalado automático** según tráfico

## 🆘 Solución de Problemas

### Build Fails
- Verificar que todas las dependencias estén en `package.json`
- Revisar logs de build en el dashboard

### Database Connection
- Verificar que `DATABASE_URL` esté configurada
- Revisar conexión en los logs del servicio

### Domain Issues
- Verificar configuración DNS
- Esperar propagación (24-48 horas)

---

¿Necesitas ayuda? Consulta la [documentación de Render](https://render.com/docs) o contacta soporte.