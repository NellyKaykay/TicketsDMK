import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
  const checks = {
    node: true,
    db_env_present: !!process.env.DATABASE_URL,
    anthropic_api_present: !!process.env.ANTHROPIC_API_KEY
  };

  return new Response(
    JSON.stringify({ ok: true, timestamp: new Date().toISOString(), checks }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};

export const prerender = false;
