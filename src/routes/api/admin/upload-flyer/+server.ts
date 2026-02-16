import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';
import { getSupabaseAdmin } from '$lib/server/supabase';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const adminToken = env.ADMIN_TOKEN;
    const token = request.headers.get('x-admin-token');
    if (!token || token !== adminToken) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const supabaseAdmin = getSupabaseAdmin();

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

    const { error: uploadError } = await supabaseAdmin.storage
      .from('flyers')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      return new Response(JSON.stringify({ error: uploadError.message }), { status: 500 });
    }

    const { data: urlData } = supabaseAdmin.storage
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
