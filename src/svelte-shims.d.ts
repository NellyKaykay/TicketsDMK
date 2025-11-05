/// <reference types="svelte" />

// Tipos para Svelte HTML
declare global {
	namespace svelteHTML {
		interface HTMLAttributes<T = any> {
			class?: string;
			[key: string]: any;
		}
	}
}

export {};