import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createClient } from '@supabase/supabase-js';
import { env as publicEnv } from '$env/dynamic/public';
import { env } from '$env/dynamic/private';

function getSupabaseAdmin() {
  const supabaseUrl = publicEnv.PUBLIC_SUPABASE_URL || env.PUBLIC_SUPABASE_URL;
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) throw new Error('Missing env: PUBLIC_SUPABASE_URL');
  if (!serviceRoleKey) throw new Error('Missing env: SUPABASE_SERVICE_ROLE_KEY');

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false }
  });
}

export const GET: RequestHandler = async ({ request }) => {
  const adminToken = env.ADMIN_TOKEN;
  if (!adminToken) {
    return json({ error: 'Missing env: ADMIN_TOKEN' }, { status: 500 });
  }

  const token = request.headers.get('x-admin-token');
  if (!token || token !== adminToken) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabaseAdmin = getSupabaseAdmin();

  const { data, error } = await supabaseAdmin
    .from('venues')
    .select('id,name,city,address')
    .order('name', { ascending: true });

  if (error) {
    return json({ error: error.message }, { status: 500 });
  }

  return json({ venues: data });
};
