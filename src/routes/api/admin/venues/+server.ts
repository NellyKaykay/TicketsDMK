import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import { getSupabaseAdmin } from '$lib/server/supabase';

export const GET: RequestHandler = async ({ request }) => {
  const adminToken = env.ADMIN_TOKEN;
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
