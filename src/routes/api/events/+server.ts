import type { RequestHandler } from './$types';
import { getSupabaseAdmin } from '$lib/server/supabase';

// GET /api/events
// - Orders by `date` DESC
// - Limits to 200 rows
// - Selects nested `venue` (venues.name, venues.city) and `ticket_types(price_cents)`
// - Optional filter `?city=Name` applies to venues.city (case-insensitive)

export const GET: RequestHandler = async ({ url }) => {
  const cityParam = url.searchParams.get('city')?.trim().toLowerCase() || null;

  try {
    const supabaseAdmin = getSupabaseAdmin();

    const { data, error } = await supabaseAdmin
      .from('events')
      .select('id,title,artist,date,flyer_url,venue:venues(name,city),ticket_types(price_cents,capacity,sold)')
      .order('date', { ascending: false })
      .limit(200);

    if (error) {
      console.error('Supabase events list error:', error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    // Filtrar por ciudad si viene ?city=
    const filtered = (data ?? []).filter((e: any) => {
      if (!cityParam) return true;
      const vc = (e?.venue?.city ?? '').toString().trim().toLowerCase();
      return vc === cityParam;
    });

    // Adaptar al modelo que espera ConcertCard.svelte
    const events = filtered.map((e: any) => {
      const venueStr = e.venue ? `${e.venue.name} — ${e.venue.city}` : '';

      // precio mínimo (cents) desde ticket_types
      const prices = (e.ticket_types ?? [])
        .map((t: any) => t?.price_cents)
        .filter((n: any) => typeof n === 'number');

      const minPrice = prices.length ? Math.min(...prices) : null;

      // disponibilidad básica por sold/capacity si existe, si no -> available
      const tts = e.ticket_types ?? [];
      const hasCapacityInfo = tts.some((t: any) => typeof t?.capacity === 'number');
      let availability: 'available' | 'limited' | 'sold-out' = 'available';

      if (hasCapacityInfo) {
        const totalCap = tts.reduce((acc: number, t: any) => acc + (typeof t.capacity === 'number' ? t.capacity : 0), 0);
        const totalSold = tts.reduce((acc: number, t: any) => acc + (typeof t.sold === 'number' ? t.sold : 0), 0);

        if (totalCap > 0) {
          const remaining = totalCap - totalSold;
          if (remaining <= 0) availability = 'sold-out';
          else if (remaining <= Math.max(10, Math.ceil(totalCap * 0.1))) availability = 'limited';
          else availability = 'available';
        }
      }

      return {
        id: e.id,                          // UUID real
        title: e.title ?? '',
        artist: e.artist ?? '',
        date: e.date,
        venue: venueStr,                   // string como espera tu interfaz
        image: e.flyer_url ?? '',          // aquí mapeamos flyer_url -> image
        price: minPrice == null ? '' : `${(minPrice / 100).toFixed(2)} €`,
        category: 'General',
        availability
      };
    });

    return new Response(JSON.stringify({ events }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    console.error('Events GET fatal:', err);
    return new Response(JSON.stringify({ error: 'Unexpected server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
