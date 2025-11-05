// Svelte HTML types fix
declare global {
	namespace svelteHTML {
		// Extend existing HTML attributes
		interface HTMLAttributes<T = HTMLElement> {
			// Add any custom properties you need
			[key: string]: any;
		}
	}
}

export {};