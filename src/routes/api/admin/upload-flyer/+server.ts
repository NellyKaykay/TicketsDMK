import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

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

export const POST: RequestHandler = async ({ request }) => {
  try {
    const token = request.headers.get('x-admin-token');
    const adminTokenValue = getAdminToken();
    if (!token || token !== adminTokenValue) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');
    if (!file || typeof file === 'string') {
      return new Response(JSON.stringify({ error: 'No file uploaded' }), { status: 400 });
    }

    const ext = file.name.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const filePath = `flyers/${fileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const admin = getSupabaseAdmin();
    const { error: uploadError } = await admin.storage
      .from('flyers')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      return new Response(JSON.stringify({ error: uploadError.message }), { status: 500 });
    }

    const { data: urlData } = admin.storage
      .from('flyers')
      .getPublicUrl(filePath);

    return new Response(JSON.stringify({ publicUrl: urlData.publicUrl }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message || 'Upload failed' }), { status: 500 });
  }
};
