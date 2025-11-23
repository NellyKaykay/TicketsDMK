import { writable } from 'svelte/store';

export const currentLang = writable('es');
export const translations = writable({});

// Cargar traducción inicial
loadTranslations('es');

export async function loadTranslations(lang: string) {
  try {
    const data = await import(`../locales/${lang}.json`);
    translations.set(data.default || data);
    currentLang.set(lang);
  } catch (e) {
    translations.set({});
  }
}
