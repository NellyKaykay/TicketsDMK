import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getStripe } from '$lib/server/stripe';
import { getSupabaseAdmin } from '$lib/server/supabase';

interface LineItem {
  ticket_type_id: string;
  zone: string;
  seats: { seatId: string; row: string; number: number }[];
  unit_cents: number;
}

export const POST: RequestHandler = async ({ request, url }) => {
  try {
    const body = await request.json();
    const { event_id, email, items } = body as {
      event_id: string;
      email: string;
      items: LineItem[];
    };

    if (!event_id || !email || !items?.length) {
      return json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    const stripe = getStripe();
    const supabase = getSupabaseAdmin();

    // Fetch event info for Stripe description
    const { data: event } = await supabase
      .from('events')
      .select('title, date, venues(name, city)')
      .eq('id', event_id)
      .single();

    if (!event) {
      return json({ error: 'Evento no encontrado' }, { status: 404 });
    }

    const venue = Array.isArray(event.venues) ? event.venues[0] : event.venues;

    // Build Stripe line items
    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'eur',
        unit_amount: item.unit_cents,
        product_data: {
          name: `${item.zone} — ${event.title}`,
          description: item.seats.map(s => `Fila ${s.row}, Asiento ${s.number}`).join(' | ')
        }
      },
      quantity: item.seats.length
    }));

    // Create Stripe Checkout Session
    const origin = url.origin;
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: lineItems,
      metadata: {
        event_id,
        email,
        items_json: JSON.stringify(items),
        event_title: event.title,
        event_date: event.date || '',
        venue_name: venue?.name || '',
        venue_city: venue?.city || ''
      },
      success_url: `${origin}/tickets/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/events/${event_id}?payment=cancelled`
    });

    return json({ sessionUrl: session.url });
  } catch (err: any) {
    console.error('Checkout error:', err);
    return json({ error: err.message || 'Error al crear la sesión de pago' }, { status: 500 });
  }
};
