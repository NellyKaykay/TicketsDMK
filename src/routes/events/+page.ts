import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
  try {
    const res = await fetch('/api/events');
    if (!res.ok) return { events: [] };
    const payload = await res.json();
    // filter upcoming: date >= today (include today's events)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const events = (payload.events || []).filter((e: any) => {
      const d = new Date(e.date);
      return !isNaN(d.getTime()) && d >= today;
    });
    return { events };
  } catch (e) {
    return { events: [] };
  }
};

export const prerender = false;
