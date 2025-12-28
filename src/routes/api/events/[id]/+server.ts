import { supabase } from '$lib/supabaseClient';
import type { RequestHandler } from './$types';

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const GET: RequestHandler = async ({ params }) => {
  const id = params.id;

  if (!id || !UUID_RE.test(id)) {
    return new Response(
      JSON.stringify({ error: 'Invalid event identifier; use the event UUID.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // 1) Event
    const { data: eventRow, error: eventError } = await supabase
      .from('events')
      .select('id, title, artist, date, description, flyer_url, venue_id')
      .eq('id', id)
      .maybeSingle();

    if (eventError) {
      console.error('Supabase event fetch error:', eventError);
      return new Response(JSON.stringify({ error: eventError.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!eventRow) {
      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 2) Ticket types (zones)
    const { data: ticketTypes, error: ttError } = await supabase
      .from('ticket_types')
      .select('id, name, price_cents, currency, capacity, sold, sort_order, color, zone_code')
      .eq('event_id', eventRow.id)
      .order('sort_order', { ascending: true });

    if (ttError) {
      console.warn('ticket_types fetch warning:', ttError);
    }

    // 3) Venue (by venue_id)
    let venue: any = null;
    if (eventRow.venue_id) {
      const { data: vData, error: vError } = await supabase
        .from('venues')
        .select('id, name, city, address')
        .eq('id', eventRow.venue_id)
        .single();

      if (vError) console.warn('venues fetch warning:', vError);
      venue = vData ?? null;
    }

    // 4) Layout (by venue_id)
    let layout: any = null;
    if (eventRow.venue_id) {
      const { data: lData, error: lError } = await supabase
        .from('venue_layouts')
        .select('layout_json')
        .eq('venue_id', eventRow.venue_id)
        .single();

      if (lError) {
        // si no existe aún, no pasa nada
        if ((lError as any)?.code !== 'PGRST116') {
          console.warn('venue_layouts fetch warning:', lError);
        }
      } else {
        layout = lData?.layout_json ?? null;
      }
    }

    return new Response(
      JSON.stringify({
        event: {
          id: eventRow.id,
          title: eventRow.title,
          artist: eventRow.artist,
          date: eventRow.date,
          description: eventRow.description,
          flyer_url: eventRow.flyer_url ?? null,
          venue_id: eventRow.venue_id ?? null
        },
        venue,
        ticket_types: ticketTypes ?? [],
        layout
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('Unexpected API error:', err);
    return new Response(JSON.stringify({ error: err?.message || String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
