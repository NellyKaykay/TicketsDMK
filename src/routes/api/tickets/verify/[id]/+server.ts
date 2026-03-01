import type { RequestHandler } from './$types';
import { getSupabaseAdmin } from '$lib/server/supabase';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
  const supabase = getSupabaseAdmin();

  const { data: ticket, error } = await supabase
    .from('tickets')
    .select('id, zone, row, seat_number, status, event_id, order_id, email')
    .eq('id', params.id)
    .single();

  if (error || !ticket) {
    return json({ valid: false, error: 'Ticket no encontrado' }, { status: 404 });
  }

  // Get event info
  const { data: event } = await supabase
    .from('events')
    .select('title, date')
    .eq('id', ticket.event_id)
    .single();

  return json({
    valid: ticket.status === 'valid',
    status: ticket.status,
    ticket: {
      id: ticket.id,
      zone: ticket.zone,
      row: ticket.row,
      seat_number: ticket.seat_number,
      event_title: event?.title || '',
      event_date: event?.date || ''
    }
  });
};
