import type { RequestHandler } from './$types';
import { createClient } from '@supabase/supabase-js';
import { env as publicEnv } from '$env/dynamic/public';
import { env } from '$env/dynamic/private';

export const GET: RequestHandler = async () => {
  const supabaseUrl = publicEnv.PUBLIC_SUPABASE_URL || env.PUBLIC_SUPABASE_URL;
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return new Response(
      JSON.stringify({ error: 'Missing Supabase env vars' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  return new Response(JSON.stringify({ supabase: 'ok' }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
