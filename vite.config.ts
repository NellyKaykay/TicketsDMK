import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
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
