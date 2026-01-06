import { json } from '@sveltejs/kit';
import { supabase } from '$lib/server/supabase';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
  const venueId = params.id;

  if (!venueId) {
    return json({ error: 'Missing venue id' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('venue_seat_maps')
    .select('layout, layout_version, updated_at')
    .eq('venue_id', venueId)
    .single();

  if (error) {
    return json({ error: error.message }, { status: 404 });
  }

  return json({
    venue_id: venueId,
    ...data
  });
};
