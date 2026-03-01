import QRCode from 'qrcode';

/**
 * Generate a QR code as a data-URI PNG string.
 * The QR encodes a verification URL with the ticket ID.
 */
export async function generateTicketQR(ticketId: string, origin: string): Promise<string> {
  const verifyUrl = `${origin}/tickets/verify/${ticketId}`;
  return QRCode.toDataURL(verifyUrl, {
    width: 300,
    margin: 2,
    color: { dark: '#003333', light: '#ffffff' }
  });
}
