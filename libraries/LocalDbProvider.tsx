import React, { createContext, ReactNode } from 'react';
import { RxDatabase } from 'rxdb';

export const LocalDbContext = createContext<RxDatabase>(null);

export interface LocalDbProviderProps {
  localDb: RxDatabase;
  children: ReactNode | ReactNode[];
}

export function LocalDbProvider({ children, localDb }: LocalDbProviderProps) {
  return (
    <LocalDbContext.Provider value={localDb}>
      {children}
    </LocalDbContext.Provider>
  );
}
