import { writable, derived } from 'svelte/store';

export interface CartSeat {
  seatId: string;
  row: string;
  number: number;
  zone: 'VIP' | 'PREFERENTE' | 'GENERAL';
  priceCents: number;
}

export const cart = writable<CartSeat[]>([]);

export function toggleSeat(seat: CartSeat) {
  cart.update(items => {
    const idx = items.findIndex(s => s.seatId === seat.seatId);
    if (idx >= 0) {
      return items.filter((_, i) => i !== idx);
    }
    return [...items, seat];
  });
}

export function removeSeat(seatId: string) {
  cart.update(items => items.filter(s => s.seatId !== seatId));
}

export function clearCart() {
  cart.set([]);
}

export const cartTotal = derived(cart, $cart =>
  $cart.reduce((sum, s) => sum + s.priceCents, 0)
);

export const cartSeatIds = derived(cart, $cart =>
  new Set($cart.map(s => s.seatId))
);
