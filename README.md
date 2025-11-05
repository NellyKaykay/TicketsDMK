# 🎫 TicketsDMK

Plataforma moderna de venta de entradas para eventos de Dread Mar-K, construida con SvelteKit y optimizada para dispositivos móviles.

## ✨ Características

- 🎨 **Diseño Responsive** - Perfecta experiencia en móvil, tablet y desktop
- 🎵 **Eventos Dinámicos** - Barcelona, Madrid, Valencia, Alicante
- 🛒 **Sistema de Venta** - Integración con Stripe para pagos seguros
- 👤 **Autenticación** - Registro y login de usuarios
- 📧 **Confirmaciones** - Tickets enviados por email
- 🔒 **Seguro** - SSL automático y base de datos PostgreSQL

## 🚀 Despliegue

Este proyecto está configurado para desplegarse en **Render.com** con:
- Hosting gratuito con SSL
- Base de datos PostgreSQL incluida
- Dominio personalizado: `ticketsdmk.com`

Ver [DEPLOY_RENDER.md](./DEPLOY_RENDER.md) para instrucciones completas.

## 🛠️ Desarrollo Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## 📋 Stack Tecnológico

- **Frontend**: SvelteKit + TailwindCSS
- **Backend**: Node.js (adaptador SvelteKit)
- **Base de Datos**: PostgreSQL
- **Pagos**: Stripe
- **Hosting**: Render.com
- **Emails**: SMTP (Gmail/SendGrid)

## 🎯 Próximas Funcionalidades

- [ ] Sistema completo de usuarios
- [ ] Integración de pagos con Stripe
- [ ] Generación de tickets PDF
- [ ] Panel de administración
- [ ] Sistema de notificaciones
- [ ] Analytics de ventas

## 📁 Estructura del Proyecto

```
src/
├── routes/              # Páginas de la aplicación
│   ├── +page.svelte    # Página principal
│   ├── login/          # Autenticación
│   ├── register/       # Registro
│   └── events/         # Páginas de eventos
├── lib/
│   ├── components/     # Componentes reutilizables
│   ├── stores/         # Estado global
│   └── utils/          # Utilidades
└── app.html            # Template principal
```

## 🔧 Configuración

1. Copia `.env.example` a `.env`
2. Configura las variables de entorno necesarias
3. Para producción, configura las variables en Render

## 📱 Diseño Responsive

El proyecto utiliza un sistema de breakpoints optimizado:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

## 🤝 Contribuir

1. Fork del proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver [LICENSE](LICENSE) para detalles.

---

Desarrollado con ❤️ para la comunidad de Dread Mar-K
