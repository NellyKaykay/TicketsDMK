import type { PageLoad } from './$types';

const VALID_CITIES = ['barcelona', 'madrid', 'valencia', 'alicante'];

export const load: PageLoad = async ({ params, fetch }) => {
  const citySlug = params.city.toLowerCase();

  if (!VALID_CITIES.includes(citySlug)) {
    return { city: null, events: [], error: { status: 404, message: 'Ciudad no encontrada' } };
  }

  const cityName = citySlug.charAt(0).toUpperCase() + citySlug.slice(1);

  try {
    const res = await fetch('/api/events');
    if (!res.ok) {
      return { city: cityName, events: [], error: { status: res.status, message: 'Error cargando eventos' } };
    }

    const payload = await res.json();
    const allEvents = payload.events ?? [];

    // Filter events by city (case-insensitive)
    const cityEvents = allEvents.filter((e: any) =>
      (e.city || '').toLowerCase() === citySlug
    );

    // For each event, load full detail (with ticket_types)
    const eventsWithDetails = await Promise.all(
      cityEvents.map(async (e: any) => {
        try {
          const detailRes = await fetch(`/api/events/${e.id}`);
          if (!detailRes.ok) return { ...e, ticket_types: [], venue: null, layout: null };
          const detail = await detailRes.json();
          return {
            ...e,
            ticket_types: detail.ticket_types ?? [],
            venue: detail.venue ?? null,
            layout: detail.layout ?? null
          };
        } catch {
          return { ...e, ticket_types: [], venue: null, layout: null };
        }
      })
    );

    return { city: cityName, events: eventsWithDetails };
  } catch (e: any) {
    return { city: cityName, events: [], error: { status: 500, message: e?.message || String(e) } };
  }
};
