import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);

	// Static assets from /static/ get short cache (10 min) + must-revalidate
	// so updated files (like logos) are picked up quickly
	const { pathname } = event.url;
	if (
		pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/) &&
		!pathname.startsWith('/_app/')
	) {
		response.headers.set('Cache-Control', 'public, max-age=600, must-revalidate');
	}

	return response;
};
