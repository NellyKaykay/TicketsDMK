import type { RequestHandler } from '@sveltejs/kit';
import createClaudeCompletion from '$lib/ai/anthropic';
import { supabase } from '$lib/supabaseClient';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const { prompt, max_tokens, temperature } = body || {};

    if (!prompt || typeof prompt !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing or invalid `prompt` in request body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Autenticación: se requiere header Authorization: Bearer <access_token>
    const auth = request.headers.get('authorization') || '';
    const match = auth.match(/Bearer\s+(.+)/i);
    if (!match) {
      return new Response(JSON.stringify({ error: 'Unauthorized: missing Authorization header' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const accessToken = match[1];

    // Validar token con Supabase (cliente anon es suficiente para validar el usuario asociado)
    const { data: userData, error: userError } = await supabase.auth.getUser(accessToken as string);
    if (userError || !userData?.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized: invalid or expired token' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const result = await createClaudeCompletion({ prompt, max_tokens: max_tokens, temperature: temperature });

    return new Response(JSON.stringify({ ok: true, result }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const prerender = false;
