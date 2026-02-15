import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { ADMIN_TOKEN } from '$env/static/private';

const supabaseAdmin = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

export const GET: RequestHandler = async ({ request }) => {
  const token = request.headers.get('x-admin-token');
  if (!token || token !== ADMIN_TOKEN) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from('venues')
    .select('id,name,city,address')
    .order('name', { ascending: true });

  if (error) {
    return json({ error: error.message }, { status: 500 });
  }

  return json({ venues: data });
};
