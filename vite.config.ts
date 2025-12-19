import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	// Ensure `process.env.NODE_ENV` is available during Vite builds.
	// SvelteKit warns when `NODE_ENV` is set in a local `.env`; defining
	// it here keeps production builds working locally/CI without a
	// risky `.env` entry. Revert if you'd rather set NODE_ENV externally.
	define: {
		'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV ?? 'production')
	},
	css: {
		devSourcemap: true,
		preprocessorOptions: {
			scss: {
				additionalData: '@import "./src/app.css";'
			}
		}
	},
	server: {
		fs: {
			allow: ['..']
		}
	},
	build: {
		cssCodeSplit: false,
		rollupOptions: {
			output: {
				manualChunks: undefined
			}
		}
	}
});
