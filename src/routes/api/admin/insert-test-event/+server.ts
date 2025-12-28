import { supabase } from '$lib/supabaseClient';
import type { RequestHandler } from './$types';

// Dev-only helper endpoint to insert a test event into `events` and return the new id.
// Usage (POST): curl -X POST http://localhost:5173/api/admin/insert-test-event
// The handler inserts a minimal set of columns. If your events table uses different
// column names (e.g. `image_id`), adjust the payload accordingly.
export const POST: RequestHandler = async () => {
  try {
    const payload = {
      title: 'Concierto de prueba',
      artist: 'Artista Demo',
      description: 'Evento de prueba para TicketsDMK',
      date: '2025-10-15 20:00:00+02',
      // Many schemas store a flyer URL; if your schema uses `image_id` instead
      // change the key here to `image_id` or the appropriate column.
      flyer_url: 'https://via.placeholder.com/800x1000.png?text=EVENT+FLYER',
      // Optional: include `venue_id` if your events table has that FK column
      // venue_id: '8392698e-43c6-40b8-a491-3ee81cb06ec0'
    } as any;

    const { data, error } = await supabase
      .from('events')
      .insert([payload])
      .select('id')
      .single();

    if (error) {
      console.error('insert-test-event error:', error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ id: data.id }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    console.error('insert-test-event unexpected:', err);
    return new Response(JSON.stringify({ error: err?.message ?? String(err) }), { status: 500 });
  }
};
