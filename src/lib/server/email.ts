import nodemailer from 'nodemailer';
import { env } from '$env/dynamic/private';

function getTransporter() {
  return nodemailer.createTransport({
    host: env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(env.EMAIL_PORT || '587'),
    secure: false,
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_PASS
    }
  });
}

export interface TicketEmailData {
  to: string;
  eventTitle: string;
  eventDate: string;
  venueName: string;
  seats: { zone: string; row: string; number: number }[];
  totalFormatted: string;
  qrDataUri: string;    // base64 data-uri PNG
  ticketId: string;
  orderId: string;
}

export async function sendTicketEmail(data: TicketEmailData): Promise<void> {
  const transporter = getTransporter();

  // Extract the base64 image from the data URI
  const qrBase64 = data.qrDataUri.replace(/^data:image\/png;base64,/, '');

  const seatRows = data.seats
    .map(s => `<tr><td style="padding:4px 12px;border-bottom:1px solid #e5e7eb">${s.zone}</td><td style="padding:4px 12px;border-bottom:1px solid #e5e7eb">Fila ${s.row}</td><td style="padding:4px 12px;border-bottom:1px solid #e5e7eb">Asiento ${s.number}</td></tr>`)
    .join('');

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;background:#f9fafb;margin:0;padding:0">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,51,51,0.12)">
    <!-- Header -->
    <div style="background:#003333;color:#ffffff;padding:24px 32px;text-align:center">
      <h1 style="margin:0;font-size:24px">🎫 Tu entrada está lista</h1>
      <p style="margin:8px 0 0;font-size:14px;color:#a7f3d0">Pedido #${data.orderId.slice(0, 8).toUpperCase()}</p>
    </div>

    <!-- Event Info -->
    <div style="padding:24px 32px">
      <h2 style="margin:0 0 8px;color:#003333;font-size:20px">${data.eventTitle}</h2>
      <p style="margin:0;color:#6b7280;font-size:14px">📅 ${data.eventDate}</p>
      <p style="margin:4px 0 0;color:#6b7280;font-size:14px">📍 ${data.venueName}</p>

      <!-- Seats Table -->
      <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px">
        <thead>
          <tr style="background:#f3f4f6">
            <th style="padding:8px 12px;text-align:left;color:#374151">Zona</th>
            <th style="padding:8px 12px;text-align:left;color:#374151">Fila</th>
            <th style="padding:8px 12px;text-align:left;color:#374151">Asiento</th>
          </tr>
        </thead>
        <tbody>
          ${seatRows}
        </tbody>
      </table>

      <div style="text-align:right;font-size:18px;font-weight:bold;color:#003333;margin:8px 0">
        Total: ${data.totalFormatted}
      </div>

      <!-- QR Code -->
      <div style="text-align:center;margin:24px 0;padding:20px;background:#f9fafb;border-radius:8px">
        <p style="margin:0 0 12px;color:#374151;font-size:14px;font-weight:600">Muestra este código QR en la entrada</p>
        <img src="cid:ticketqr" alt="QR de entrada" style="width:200px;height:200px" />
        <p style="margin:12px 0 0;color:#9ca3af;font-size:12px">ID: ${data.ticketId.slice(0, 12).toUpperCase()}</p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#f3f4f6;padding:16px 32px;text-align:center;color:#9ca3af;font-size:12px">
      <p style="margin:0">No compartas este QR con nadie. Es tu entrada personal.</p>
      <p style="margin:8px 0 0">TicketsDMK — Compra segura de entradas</p>
    </div>
  </div>
</body>
</html>`;

  await transporter.sendMail({
    from: `"TicketsDMK" <${env.EMAIL_USER}>`,
    to: data.to,
    subject: `🎫 Tu entrada para ${data.eventTitle}`,
    html,
    attachments: [
      {
        filename: 'ticket-qr.png',
        content: Buffer.from(qrBase64, 'base64'),
        cid: 'ticketqr'
      }
    ]
  });
}
