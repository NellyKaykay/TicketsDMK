import { getSupabaseAdmin } from '$lib/server/supabase';
import type { RequestHandler } from './$types';
import { readFile } from 'fs/promises';
import path from 'path';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const GET: RequestHandler = async ({ params }) => {
  const id = params.id;
  if (!id) {
    return new Response(
      JSON.stringify({ error: 'Missing event identifier.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const supabase = getSupabaseAdmin();

    // 1) Event + ticket_types (select anidado)
    let eventRow: any = null;
    let eventError: any = null;
    let eventRes: any = null;

    if (UUID_RE.test(id)) {
      eventRes = await supabase
        .from('events')
        .select(`
          id,
          title,
          artist,
          date,
          description,
          flyer_url,
          venue_id,
          ticket_types (
            id,
            name,
            zone_code,
            price_cents,
            currency,
            capacity,
            sold,
            sort_order,
            color
          )
        `)
        .eq('id', id)
        .maybeSingle();
      eventRow = eventRes.data;
      eventError = eventRes.error;
    } else {
      // try numeric legacy id
      if (/^\d+$/.test(id)) {
        eventRes = await supabase
          .from('events')
          .select(`
            id,
            title,
            artist,
            date,
            description,
            flyer_url,
            venue_id,
            ticket_types (
              id,
              name,
              zone_code,
              price_cents,
              currency,
              capacity,
              sold,
              sort_order,
              color
            )
          `)
          .eq('legacy_id', Number(id))
          .maybeSingle();
        eventRow = eventRes.data;
        eventError = eventRes.error;
      }
    }

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

    // Debug: mostrar ticket_types recibidos
    console.log('API ticket_types:', eventRow.ticket_types);

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

    // 4) Layout (by venue_id) — if not present in DB, try a static city-based fallback
    let layout: any = null;
    if (eventRow.venue_id) {
      const { data: lData, error: lError } = await supabase
        .from('venue_layouts')
        .select('layout_json')
        .eq('venue_id', eventRow.venue_id)
        .single();

      if (lError) {
        if ((lError as any)?.code !== 'PGRST116') {
          console.warn('venue_layouts fetch warning:', lError);
        }
      } else {
        layout = lData?.layout_json ?? null;
      }
    }

    // If no layout in DB, try loading a static layout based on venue.city
    if (!layout && eventRow.venue_id) {
      try {
        // try to get venue city first (if we fetched venue earlier)
        let venueCity: string | null = null;
        if (!venue && eventRow.venue_id) {
          const { data: vData } = await supabase
            .from('venues')
            .select('city')
            .eq('id', eventRow.venue_id)
            .maybeSingle();
          venueCity = vData?.city ?? null;
        } else {
          venueCity = venue?.city ?? null;
        }

        if (venueCity) {
          const key = venueCity.toString().trim().toLowerCase().replace(/\s+/g, '-');
          const layoutPath = path.join(process.cwd(), 'src', 'lib', 'venue_layouts', `${key}.json`);
          const raw = await readFile(layoutPath, 'utf8').catch(() => null);
          if (raw) {
            layout = JSON.parse(raw);
          }
        }
      } catch (e) {
        // ignore missing static layout
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
        ticket_types: eventRow.ticket_types ?? [],
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
