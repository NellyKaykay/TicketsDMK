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