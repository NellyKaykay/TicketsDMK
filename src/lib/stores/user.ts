import { writable } from 'svelte/store';
import { supabase } from '$lib/supabaseClient';

// Store para el usuario autenticado
export const user = writable(null);

// Inicializa la sesión al cargar la app
export async function initSession() {
  const { data, error } = await supabase.auth.getUser();
  if (data?.user) {
    user.set(data.user);
  } else {
    user.set(null);
  }
}

// Escucha cambios de sesión
supabase.auth.onAuthStateChange((_event, session) => {
  user.set(session?.user || null);
});

// Cierra sesión
export async function logout() {
  await supabase.auth.signOut();
  user.set(null);
}
