import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/private';

// Lazy initialization to avoid accessing env at module level during build
let supabaseAdmin: SupabaseClient | null = null;
let adminToken: string | null = null;

function getSupabaseAdmin() {
  if (!supabaseAdmin) {
    const supabaseUrl = env.PUBLIC_SUPABASE_URL;
    const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl) throw new Error('Missing env: PUBLIC_SUPABASE_URL');
    if (!serviceRoleKey) throw new Error('Missing env: SUPABASE_SERVICE_ROLE_KEY');
    
    supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false }
    });
  }
  return supabaseAdmin;
}

function getAdminToken() {
  if (!adminToken) {
    adminToken = env.ADMIN_TOKEN;
    if (!adminToken) throw new Error('Missing env: ADMIN_TOKEN');
  }
  return adminToken;
}

export const GET: RequestHandler = async ({ request }) => {
  const token = request.headers.get('x-admin-token');
  const adminTokenValue = getAdminToken();
  if (!token || token !== adminTokenValue) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from('venues')
    .select('id,name,city,address')
    .order('name', { ascending: true });

  if (error) {
    return json({ error: error.message }, { status: 500 });
  }

  return json({ venues: data });
};
