import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import { PropsWithChildren, createContext, useEffect, useState } from "react";
import { initialize } from "./drizzle";

type ContextType = { db: ExpoSQLiteDatabase | null };

export const DatabaseContext = createContext<ContextType>({ db: null });

export const DatabaseProvider = ({ children }: PropsWithChildren) => {
  const [db, setDb] = useState<ExpoSQLiteDatabase | null>(null);

  useEffect(() => {
    if (db) return;
    initialize().then((newDb) => {
      setDb(newDb);
    });
  }, []);

  return (
    <DatabaseContext.Provider value={{ db }}>
      {children}
    </DatabaseContext.Provider>
  );
};
