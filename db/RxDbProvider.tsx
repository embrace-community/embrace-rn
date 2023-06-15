import React, { createContext, ReactNode } from 'react';
import { RxDatabase } from 'rxdb';

export const RxDbContext = createContext<RxDatabase>(null);

export interface RxDbProviderProps {
  rxDb: RxDatabase;
  children: ReactNode | ReactNode[];
}

export function RxDbProvider({ children, rxDb }: RxDbProviderProps) {
  return <RxDbContext.Provider value={rxDb}>{children}</RxDbContext.Provider>;
}
