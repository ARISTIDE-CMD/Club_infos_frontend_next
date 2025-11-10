// store.ts
import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  loggedOut: false,
  setLoggedOut: (value: boolean) => set({ loggedOut: value }),
}));
