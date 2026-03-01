import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import { getStripe } from '$lib/server/stripe';
import { getSupabaseAdmin } from '$lib/server/supabase';
import { generateTicketQR } from '$lib/server/qr';
import { sendTicketEmail } from '$lib/server/email';

export const POST: RequestHandler = async ({ request, url }) => {
  const stripe = getStripe();
  const endpointSecret = env.STRIPE_WEBHOOK_SECRET;

  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  let event;
  try {
    if (endpointSecret && sig) {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } else {
      // In development without webhook secret, parse directly
      event = JSON.parse(body);
    }
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    await handleCheckoutCompleted(session, url.origin);
  }

  return new Response('OK', { status: 200 });
};

async function handleCheckoutCompleted(session: any, origin: string) {
  const supabase = getSupabaseAdmin();
  const meta = session.metadata;

  if (!meta?.event_id || !meta?.email || !meta?.items_json) {
    console.error('Webhook: missing metadata', meta);
    return;
  }

  const items = JSON.parse(meta.items_json) as {
    ticket_type_id: string;
    zone: string;
    seats: { seatId: string; row: string; number: number }[];
    unit_cents: number;
  }[];

  // 1. Create order in DB
  const allSeats = items.flatMap(item =>
    item.seats.map(s => ({
      ticket_type_id: item.ticket_type_id,
      zone: item.zone,
      seat_id: s.seatId,
      row: s.row,
      number: s.number,
      price_cents: item.unit_cents
    }))
  );

  const totalCents = allSeats.reduce((sum, s) => sum + s.price_cents, 0);

  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .insert({
      event_id: meta.event_id,
      email: meta.email,
      stripe_session_id: session.id,
      stripe_payment_intent: session.payment_intent,
      total_cents: totalCents,
      currency: 'eur',
      status: 'paid',
      seats: allSeats
    })
    .select('id')
    .single();

  if (orderErr) {
    console.error('Error creating order:', orderErr);
    return;
  }

  // 2. Create individual tickets
  const ticketInserts = allSeats.map(seat => ({
    order_id: order.id,
    event_id: meta.event_id,
    email: meta.email,
    zone: seat.zone,
    row: seat.row,
    seat_number: seat.number,
    seat_id: seat.seat_id,
    price_cents: seat.price_cents,
    status: 'valid'
  }));

  const { data: tickets, error: ticketErr } = await supabase
    .from('tickets')
    .insert(ticketInserts)
    .select('id, zone, row, seat_number');

  if (ticketErr) {
    console.error('Error creating tickets:', ticketErr);
    return;
  }

  // 3. Update sold count for each ticket type
  for (const item of items) {
    await supabase.rpc('increment_sold', {
      p_ticket_type_id: item.ticket_type_id,
      p_qty: item.seats.length
    });
  }

  // 4. Generate QR for the order (one QR per order)
  const qrDataUri = await generateTicketQR(order.id, origin);

  // 5. Send email with tickets + QR
  const formatMoney = (cents: number) =>
    new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(cents / 100);

  try {
    await sendTicketEmail({
      to: meta.email,
      eventTitle: meta.event_title || 'Evento',
      eventDate: meta.event_date
        ? new Date(meta.event_date).toLocaleString('es-ES', {
            dateStyle: 'long',
            timeStyle: 'short'
          })
        : 'Por confirmar',
      venueName: [meta.venue_name, meta.venue_city].filter(Boolean).join(' — '),
      seats: (tickets || []).map(t => ({
        zone: t.zone,
        row: t.row,
        number: t.seat_number
      })),
      totalFormatted: formatMoney(totalCents),
      qrDataUri,
      ticketId: order.id,
      orderId: order.id
    });
    console.log(`✅ Ticket email sent to ${meta.email} for order ${order.id}`);
  } catch (emailErr) {
    console.error('Error sending ticket email:', emailErr);
    // Don't fail the webhook — order is already saved
  }
}
