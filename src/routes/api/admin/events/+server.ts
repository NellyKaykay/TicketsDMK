import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/private';

// Lazy initialization to avoid accessing env at module level during build
let supabaseAdminInstance: SupabaseClient | null = null;
let adminTokenInstance: string | null = null;

function getSupabaseAdmin() {
  if (!supabaseAdminInstance) {
    const supabaseUrl = env.PUBLIC_SUPABASE_URL;
    const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl) throw new Error('Missing env: PUBLIC_SUPABASE_URL');
    if (!serviceRoleKey) throw new Error('Missing env: SUPABASE_SERVICE_ROLE_KEY');
    
    supabaseAdminInstance = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false }
    });
  }
  return supabaseAdminInstance;
}

function getAdminToken() {
  if (!adminTokenInstance) {
    adminTokenInstance = env.ADMIN_TOKEN;
    if (!adminTokenInstance) throw new Error('Missing env: ADMIN_TOKEN');
  }
  return adminTokenInstance;
}

export const GET: RequestHandler = async ({ request }) => {
  const token = request.headers.get('x-admin-token');
  const adminTokenValue = getAdminToken();
  if (!token || token !== adminTokenValue) {
    return new Response(JSON.stringify({ error: 'Unauthorized', received: token }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const admin = getSupabaseAdmin();
  const { data, error } = await admin
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
    const adminTokenValue = getAdminToken();
    if (!token || token !== adminTokenValue) {
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

    const admin = getSupabaseAdmin();
    const { error } = await admin
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
    const adminTokenValue = getAdminToken();
    if (!token || token !== adminTokenValue) {
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

    const admin = getSupabaseAdmin();
    const { data, error } = await admin
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
