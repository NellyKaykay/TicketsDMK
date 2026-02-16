import type { RequestHandler } from './$types';
import { getSupabaseAdmin } from '$lib/server/supabase';

export const GET: RequestHandler = async () => {
  try {
    getSupabaseAdmin();
    return new Response(JSON.stringify({ supabase: 'ok' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: e.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
