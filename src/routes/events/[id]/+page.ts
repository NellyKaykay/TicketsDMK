import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
  try {
    const res = await fetch(`/api/events/${params.id}`);
    if (res.status === 404) {
      return { event: null, error: { status: 404, message: 'Event not found' } };
    }
    if (!res.ok) {
      const text = await res.text().catch(() => 'Unknown error');
      return { event: null, error: { status: res.status, message: text } };
    }

    const payload = await res.json();
    return { event: payload.event };
  } catch (e: any) {
    return { event: null, error: { status: 500, message: e?.message || String(e) } };
  }
};
