import migrations from "./migrations/migrations";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { openDatabaseSync } from "expo-sqlite";

const expoDb = openDatabaseSync("shiftly.db", { enableChangeListener: true });

expoDb.execAsync(`
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;
`);
export const db = drizzle(expoDb);

export const initialize = () => {
  return Promise.resolve(db);
};

export const useMigrationsHelper = () => {
  return useMigrations(db, migrations);
};
