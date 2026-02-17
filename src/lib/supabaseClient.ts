import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/public';

let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_client) {
    const supabaseUrl = env.PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = env.PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing PUBLIC_SUPABASE_URL or PUBLIC_SUPABASE_ANON_KEY');
    }
    _client = createClient(supabaseUrl, supabaseAnonKey);
  }
  return _client;
}

// Keep backwards-compatible named export (lazy getter)
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    return Reflect.get(getSupabase(), prop, receiver);
  }
});
