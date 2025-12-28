import { supabase } from '$lib/supabaseClient';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
  const id = params.id;

  try {
    // Resolve event by id (UUID) or by slug when a non-UUID param is provided.
    let eventRow: any = null;
    let eventError: any = null;

    const isUUID = typeof id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);

    if (isUUID) {
      const res = await supabase
        .from('events')
        .select('id, title, artist, date, description')
        .eq('id', id)
        .single();
      eventRow = res.data;
      eventError = res.error;
    } else {
      // Parameter is not a UUID; to avoid casting errors and optional-column lookups
      // require callers to use the UUID form for now.
      return new Response(JSON.stringify({ error: 'Invalid event identifier; use the event UUID.' }), { status: 400 });
    }

    if (eventError) {
      console.error('Supabase event fetch error:', eventError);
      return new Response(JSON.stringify({ error: eventError.message }), { status: 500 });
    }

    if (!eventRow) {
      console.warn(`Event not found for id=${id}`);
      return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
    }

    const eventId = eventRow.id;

    // Try to fetch related ticket types (best-effort)
    let ticket_types: any[] = [];
    try {
      const { data: ttData, error: ttError } = await supabase
        .from('ticket_types')
        .select('id, name, price_cents, currency, capacity, sold, sort_order, color, zone_code')
        .eq('event_id', eventId)
        .order('sort_order', { ascending: true });
      if (ttError) {
        console.warn('ticket_types fetch warning:', ttError.message);
      } else if (ttData) {
        ticket_types = ttData;
      }
    } catch (e) {
      console.warn('ticket_types fetch exception', e);
    }

    // Try to fetch venue (best-effort)
    let venue = null;
    try {
      const { data: vData, error: vError } = await supabase
        .from('venues')
        .select('id, name, city, address')
        .eq('event_id', eventId)
        .limit(1);
      if (vError) {
        console.warn('venues fetch warning:', vError.message);
      } else if (vData && vData.length) {
        venue = vData[0];
      }
    } catch (e) {
      console.warn('venues fetch exception', e);
    }

    // Attempt to read flyer column(s) defensively
    let flyer_url: string | null = null;
    try {
      const { data: fdata, error: ferr } = await supabase
        .from('events')
        .select('flyer_url')
        .eq('id', eventId)
        .single();
      if (ferr) {
        // if column doesn't exist, try legacy name
        if ((ferr as any)?.code === '42703') {
          const { data: fdata2, error: ferr2 } = await supabase
            .from('events')
            .select('flyer_image_url')
            .eq('id', eventId)
            .single();
          if (!ferr2 && fdata2) flyer_url = fdata2.flyer_image_url ?? null;
        } else {
          console.warn('flyer lookup warning:', ferr.message ?? ferr);
        }
      } else if (fdata) {
        flyer_url = fdata.flyer_url ?? null;
      }
    } catch (e) {
      console.warn('flyer lookup exception', e);
    }

    const event = {
      id: eventRow.id,
      title: eventRow.title,
      artist: eventRow.artist,
      date: eventRow.date,
      description: eventRow.description,
      flyer_url,
      venue,
      ticket_types
    };

    return new Response(JSON.stringify({ event }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    console.error('Unexpected API error:', err);
    return new Response(JSON.stringify({ error: err?.message || String(err) }), { status: 500 });
  }
};
