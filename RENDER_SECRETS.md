# Añadir secretos en Render (TicketsDMK)

Pasos para añadir las variables sensibles necesarias en Render usando el dashboard (no subirlas al repo):

1) Abrir el servicio en el Dashboard de Render
- Ve a tu servicio `ticketsdmk` en Render.

2) Ir a la sección `Environment` / `Environment Variables`

3) Añadir las siguientes variables (marcar como secret cuando corresponda):
- `ANTHROPIC_API_KEY` — (Secret) clave API de Anthropic.
- `ANTHROPIC_MODEL` — `claude-sonnet-4.5` (no es estrictamente secreto pero puedes marcarlo).
- `ENABLE_CLAUDE_SONNET` — `true` o `false` (flag de activación).
- `STRIPE_SECRET_KEY` — (Secret) clave privada de Stripe.
- `STRIPE_PUBLISHABLE_KEY` — clave pública de Stripe.
- `DATABASE_URL` — ya está configurado desde la base de datos en `render.yaml`.
- `JWT_SECRET` — (Secret) secreto JWT si no lo generas automáticamente.
- `EMAIL_USER` / `EMAIL_PASS` — (Secret) credenciales SMTP.

4) Recomendaciones de seguridad
- Marca como secret (`encrypted`) todas las claves privadas (`ANTHROPIC_API_KEY`, `STRIPE_SECRET_KEY`, `JWT_SECRET`, `EMAIL_PASS`).
- No subas tus secrets al repositorio; utiliza el Dashboard o un secret manager.

5) Probar después de configurar
- Después de añadir los secrets, redeploya el servicio desde Render.
- Verifica que `/api/health` muestre `anthropic_api_present: true`.

6) Notas operativas
- Si manejas varios entornos (staging/production), crea servicios distintos o usa ramas con variables separadas.
- Para rotación de claves, actualiza el secret en el Dashboard y redeploya.
