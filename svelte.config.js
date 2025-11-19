import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// Render.com configuration
		adapter: adapter({
			out: 'build',
			precompress: false,
			envPrefix: ''
		}),
		// Completely disable prerendering for dynamic content
		prerender: {
			entries: []
		},
		handleUnseenRoutes: 'ignore' // Solución para Render.com
	}
};

export default config;
