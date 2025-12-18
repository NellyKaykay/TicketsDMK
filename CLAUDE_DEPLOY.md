# Despliegue: Habilitar Claude Sonnet 4.5

Este documento resume los pasos recomendados para habilitar Claude Sonnet 4.5 para todos los clientes en el proyecto TicketsDMK.

1) Pre-requisitos
- Cuenta activa con Anthropic (o proveedor correspondiente) con acceso al modelo `claude-sonnet-4.5` y facturación habilitada.
- Clave API con permisos para invocar el modelo.

2) Variables de entorno (no subir claves al repo)
- `ANTHROPIC_API_KEY` (secreto)
- `ANTHROPIC_MODEL=claude-sonnet-4.5`
- `ENABLE_CLAUDE_SONNET=true` (flag de activación)

Se agregó un ejemplo en `.env` como placeholder; en producción usar el secret manager del hosting (Vercel/Netlify/AWS/GCP/Heroku).

3) Cambios en backend
- Usar sólo desde código server-side. Se incluyó `src/lib/ai/anthropic.ts` que lee `ANTHROPIC_*`.
- Crear endpoints server-only que llamen al wrapper (ej: `src/routes/api/ai/claude/+server.ts` ya añadido).

4) Seguridad y límites
- Protege el endpoint: autenticación (JWT/session) y autorización por roles si aplica.
- Añade rate limiting y quotas por usuario para controlar costos.
- Valida y sanitiza `prompt` desde el cliente antes de reenviarlo.

5) Entorno y despliegue
- Añadir `ANTHROPIC_API_KEY` al secret manager del proveedor de hosting.
- Establecer `ORIGIN=https://www.ticketsdmk.com` y `PUBLIC_API_URL` como corresponda (ej. `https://api.ticketsdmk.com`).
- Configurar dominio `api.ticketsdmk.com` con SSL y apuntarlo al backend si se usa subdominio.

6) Pruebas (local y staging)
- Prueba local (con `ANTHROPIC_API_KEY` exportada):
```
curl -X POST 'http://localhost:5173/api/ai/claude' \
  -H 'Content-Type: application/json' \
  -d '{"prompt":"Escribe un saludo breve","max_tokens":60}'
```
- Verificar respuesta y manejar errores (400/500). Verificar tiempos de respuesta.

7) Monitorización y costos
- Habilitar logs y alertas de uso/errores.
- Revisar coste por token y establecer límites diarios por cuenta.

8) Rollout y soporte
- Desplegar primero a staging, ejecutar pruebas de integración y validación de seguridad.
- Activar `ENABLE_CLAUDE_SONNET=true` en producción sólo cuando staging sea estable.
- Plan de rollback: deshabilitar la flag (`ENABLE_CLAUDE_SONNET=false`) y escalar si hay problemas.

9) Notas operativas específicas para TicketsDMK
- En `.env` se actualizó `ORIGIN` a `https://www.ticketsdmk.com` y `PUBLIC_API_URL` a `https://api.ticketsdmk.com`.
- Asegúrate de que el backend que expone `/api/ai/claude` tenga CORS configurado para `https://www.ticketsdmk.com`.

Si quieres, puedo:
- Añadir protección de autenticación al endpoint ejemplo.
- Preparar scripts de deployment para Vercel/Netlify/AWS.
