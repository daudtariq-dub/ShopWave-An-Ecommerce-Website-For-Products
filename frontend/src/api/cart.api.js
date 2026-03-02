/** Mock cart API — all cart state lives in localStorage; no server calls needed */
import { delay } from './mock';

export const cartApi = {
  getCart:   async () => { await delay(100); return { items: [] }; },
  syncCart:  async ()  => { await delay(50);  return { ok: true }; },
  mergeCart: async (guestItems) => { await delay(100); return { items: guestItems }; },
  addItem:   async ()  => { await delay(50);  return { ok: true }; },
  updateItem: async () => { await delay(50);  return { ok: true }; },
  removeItem: async () => { await delay(50);  return { ok: true }; },
  clearCart:  async () => { await delay(50);  return { ok: true }; },
};
