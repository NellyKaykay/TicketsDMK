import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { ADMIN_TOKEN } from '$env/static/private';

console.log(
  'SUPABASE CHECK:',
  !!PUBLIC_SUPABASE_URL,
  !!SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_SERVICE_ROLE_KEY?.slice(0, 9)
);

const supabaseAdmin = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

export const GET: RequestHandler = async ({ request }) => {
  const token = request.headers.get('x-admin-token');
  console.log('ADMIN_TOKEN esperado:', ADMIN_TOKEN);
  console.log('Token recibido:', token);
  if (!token || token !== ADMIN_TOKEN) {
    return new Response(JSON.stringify({ error: 'Unauthorized', received: token, expected: ADMIN_TOKEN }), {
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

export const POST: RequestHandler = async ({ request }) => {
  try {
    const token = request.headers.get('x-admin-token');
    if (!token || token !== ADMIN_TOKEN) {
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
      venue_id     // UUID de venues (lo pediremos en el siguiente paso)
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

    // ✅ Devuelve el UUID generado automáticamente
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
