import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import { getSupabaseAdmin } from '$lib/server/supabase';

function getAdminToken() {
  const adminToken = env.ADMIN_TOKEN;
  if (!adminToken) {
    throw new Error('Missing ADMIN_TOKEN env var');
  }
  return adminToken;
}

export const GET: RequestHandler = async ({ request }) => {
  const adminToken = getAdminToken();
  const supabaseAdmin = getSupabaseAdmin();

  const token = request.headers.get('x-admin-token');
  if (!token || token !== adminToken) {
    return new Response(JSON.stringify({ error: 'Unauthorized', received: token }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const { data, error } = await supabaseAdmin
    .from('events')
    .select('id,title,artist,date,flyer_url,venue_id')
    .order('date', { ascending: false })
    .limit(50);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  return new Response(JSON.stringify({ events: data }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const DELETE: RequestHandler = async ({ request }) => {
  try {
    const adminToken = getAdminToken();
    const supabaseAdmin = getSupabaseAdmin();

    const token = request.headers.get('x-admin-token');
    if (!token || token !== adminToken) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing event id' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { error } = await supabaseAdmin
      .from('events')
      .delete()
      .eq('id', id);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message ?? 'Unknown error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const adminToken = getAdminToken();
    const supabaseAdmin = getSupabaseAdmin();

    const token = request.headers.get('x-admin-token');
    if (!token || token !== adminToken) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await request.json();

    const {
      title,
      artist,
      description = null,
      date,        // ISO string o "YYYY-MM-DD"
      flyer_url = null,
      venue_id,    // UUID de venues
      zones = []   // [{ zone_code, name, price }]
    } = body;

    if (!title || !artist || !date || !venue_id) {
      return new Response(JSON.stringify({ error: 'Missing fields: title, artist, date, venue_id' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { data, error } = await supabaseAdmin
      .from('events')
      .insert({
        title,
        artist,
        description,
        date,
        flyer_url,
        venue_id
      })
      .select('id')
      .single();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create ticket_types for each zone
    if (zones.length > 0) {
      const ZONE_CONFIG: Record<string, { color: string; capacity: number; sort_order: number }> = {
        A: { color: '#f59e0b', capacity: 56, sort_order: 1 },
        B: { color: '#38bdf8', capacity: 100, sort_order: 2 },
        C: { color: '#34d399', capacity: 144, sort_order: 3 }
      };

      const ticketRows = zones.map((z: { zone_code: string; name: string; price: number }) => {
        const cfg = ZONE_CONFIG[z.zone_code] || { color: '#cbd5e1', capacity: 0, sort_order: 9 };
        return {
          event_id: data.id,
          name: z.name,
          zone_code: z.zone_code,
          price_cents: Math.round(z.price * 100),
          currency: 'EUR',
          capacity: cfg.capacity,
          sold: 0,
          color: cfg.color,
          sort_order: cfg.sort_order
        };
      });

      const { error: ttError } = await supabaseAdmin
        .from('ticket_types')
        .insert(ticketRows);

      if (ttError) {
        return new Response(JSON.stringify({ error: 'Evento creado pero fallo al crear precios: ' + ttError.message, event_id: data.id }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    return new Response(JSON.stringify({ ok: true, event_id: data.id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message ?? 'Unknown error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
