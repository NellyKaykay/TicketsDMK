import { createClient } from '@supabase/supabase-js';
import { env as publicEnv } from '$env/dynamic/public';
import { env } from '$env/dynamic/private';

let _supabaseAdmin: ReturnType<typeof createClient> | null = null;
let _isInitializing = false;

export function getSupabaseAdmin() {
  // Simple initialization guard (note: not fully thread-safe but sufficient for Node.js event loop)
  if (_isInitializing) {
    throw new Error('Supabase client is currently being initialized');
  }

  if (!_supabaseAdmin) {
    _isInitializing = true;
    try {
      const supabaseUrl = publicEnv.PUBLIC_SUPABASE_URL || env.PUBLIC_SUPABASE_URL;
      const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

      if (!supabaseUrl || !serviceRoleKey) {
        throw new Error('Missing required environment variables: PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
      }

      _supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
        auth: { persistSession: false }
      });
    } finally {
      _isInitializing = false;
    }
  }
  return _supabaseAdmin;
}

// For backward compatibility, export as supabaseAdmin
// But note: This will throw at build time if env vars are not available
// Prefer using getSupabaseAdmin() in request handlers
export const supabaseAdmin = new Proxy({} as ReturnType<typeof createClient>, {
  get(_target, prop) {
    return getSupabaseAdmin()[prop as keyof ReturnType<typeof createClient>];
  }
});
