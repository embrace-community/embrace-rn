import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface AccountState {
  currentAccount?: string;
  set: (account: string) => void;
}

export const useAccountStore = create<AccountState>()(
  devtools(
    persist(
      (set) => ({
        currentAccount: null,
        set: (account) => set((state) => ({ currentAccount: account })),
      }),
      {
        name: 'account-storage',
      },
    ),
  ),
);
