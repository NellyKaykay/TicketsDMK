import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/private';


const supabaseUrl = env.PUBLIC_SUPABASE_URL;
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;
const adminToken = env.ADMIN_TOKEN;

if (!supabaseUrl) throw new Error('Missing env: PUBLIC_SUPABASE_URL');
if (!serviceRoleKey) throw new Error('Missing env: SUPABASE_SERVICE_ROLE_KEY');
if (!adminToken) throw new Error('Missing env: ADMIN_TOKEN');

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false }
});

export const GET: RequestHandler = async ({ request }) => {
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
