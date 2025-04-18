import { drizzle } from "drizzle-orm/expo-sqlite";
import { eq } from "drizzle-orm";
import { useSQLiteContext } from "expo-sqlite";
import {
  type PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  type Job,
  type NewJob,
  type NewPaycycle,
  type NewShift,
  type Paycycle,
  type Shift,
  job,
  paycycle,
  shift,
} from "./schema";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "./migrations/migrations";

if (
  !process.env.EXPO_PUBLIC_TURSO_DB_URL ||
  !process.env.EXPO_PUBLIC_TURSO_DB_AUTH_TOKEN
) {
  throw new Error("Turso DB URL and Auth Token must be set in .env.local");
}

export const DATABASE_NAME = "shiftly.db";

export const tursoOptions = {
  url: process.env.EXPO_PUBLIC_TURSO_DB_URL,
  authToken: process.env.EXPO_PUBLIC_TURSO_DB_AUTH_TOKEN,
};

interface DataContextType {
  createShift: (
    // id is auto generated and can be omitted
    newShiftData: Omit<NewShift, "id">,
  ) => Promise<Shift | undefined>;
  updateShift: (
    id: number,
    updatedShiftData: Partial<Omit<Shift, "id">>,
  ) => Promise<Shift | undefined>;
  deleteShift: (id: number) => Promise<void>;
  createPaycycle: (
    // id is auto generated and can be omitted
    newPaycycleData: Omit<NewPaycycle, "id">,
  ) => Promise<Paycycle | undefined>;
  deletePaycycle: (id: number) => Promise<void>;
  jobs: Job[];
  createJob: (
    // id is auto generated and can be omitted
    newJobData: Omit<NewJob, "id">,
  ) => Promise<Job | undefined>;
  updateJob: (
    id: number,
    updatedJobData: Partial<Omit<Job, "id">>,
  ) => Promise<Job | undefined>;
  deleteJob: (id: number) => Promise<void>;
  isMigrating: boolean;
  migrationError: Error | undefined;
  isSyncing: boolean;
  toggleSync: (enabled: boolean) => void;
}

export const DataContext = createContext<DataContextType | null>(null);

export const DataProvider = ({ children }: PropsWithChildren) => {
  const expoDb = useSQLiteContext();
  expoDb.execAsync(`
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;
`);

  const drizzleDb = useMemo(
    () =>
      drizzle(expoDb, {
        schema: {
          shift,
          paycycle,
          job,
        },
      }),
    [expoDb],
  );

  const [jobs, setJobs] = useState<Job[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationError, setMigrationError] = useState<Error | undefined>();
  const syncIntervalRef = useRef<number>(null);

  // --- Fetch initial data using Drizzle ---
  const fetchJobs = useCallback(async () => {
    try {
      // Use Drizzle's select syntax
      const result = await drizzleDb.query.job.findMany();
      setJobs(result);
    } catch (e) {
      console.error("Failed to fetch jobs:", e);
    }
  }, [drizzleDb]);

  // Initial fetch effect
  useEffect(() => {
    const { success, error } = useMigrations(drizzleDb, migrations);
    setIsMigrating(true);

    if (error) {
      setMigrationError(error);
    }

    if (success) {
      setIsMigrating(false);
      fetchJobs();
    }
  }, [fetchJobs, drizzleDb]);

  // Cleanup effect for interval
  useEffect(() => {
    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, []);

  // --- Sync function (uses expoDb for sync, then Drizzle fetches) ---
  const syncData = useCallback(async () => {
    console.log("Syncing data with Turso DB...");
    try {
      // 3. Use the ORIGINAL expoDb instance for syncLibSQL
      await expoDb.syncLibSQL();
      console.log("Synced data with Turso DB. Refetching...");
      // 4. Refetch data using Drizzle-based fetch functions
      await fetchJobs();
    } catch (e) {
      console.error("Sync failed:", e);
    }
  }, [expoDb, fetchJobs]); // Include all fetch functions

  // Toggle sync remains the same, using syncData
  const toggleSync = useCallback(
    async (enabled: boolean) => {
      // ... (implementation is the same, calls syncData) ...
      setIsSyncing(enabled);
      if (enabled) {
        console.log("Starting sync interval...");
        await syncData(); // Sync immediately when enabled
        syncIntervalRef.current = setInterval(syncData, 2000);
      } else if (syncIntervalRef.current) {
        console.log("Stopping sync interval...");
        clearInterval(syncIntervalRef.current);
      }
    },
    [syncData],
  );

  // --- Refactor CRUD operations using Drizzle ---
  const createShift = async (
    newShiftData: Omit<NewShift, "id">,
  ): Promise<Shift | undefined> => {
    try {
      const result = await drizzleDb
        .insert(shift)
        .values(newShiftData)
        .returning(); // .returning() gets the inserted row(s)

      if (result && result.length > 0) {
        return result[0];
      }
    } catch (e) {
      console.error("Failed to create shift:", e);
    }
    return undefined;
  };

  const createJob = async (
    newJobData: Omit<NewJob, "id">,
  ): Promise<Job | undefined> => {
    try {
      const result = await drizzleDb.insert(job).values(newJobData).returning(); // .returning() gets the inserted row(s)

      if (result && result.length > 0) {
        return result[0];
      }
    } catch (e) {
      console.error("Failed to create job:", e);
    }
    return undefined;
  };

  const createPaycycle = async (
    newPaycycleData: Omit<NewPaycycle, "id">,
  ): Promise<Paycycle | undefined> => {
    try {
      const result = await drizzleDb
        .insert(paycycle)
        .values(newPaycycleData)
        .returning(); // .returning() gets the inserted row(s)

      if (result && result.length > 0) {
        return result[0];
      }
    } catch (e) {
      console.error("Failed to create paycycle:", e);
    }
    return undefined;
  };

  const updateShift = async (
    id: number,
    updates: Partial<Omit<Shift, "id">>,
  ) => {
    try {
      const result = await drizzleDb
        .update(shift)
        .set(updates)
        .where(eq(shift.id, id))
        .returning();

      if (result && result.length > 0) {
        return result[0];
      }
      // Handle case where update didn't affect any rows (e.g., ID not found)
      console.warn(`Shift with ID ${id} not found for update.`);
    } catch (e) {
      console.error("Failed to update shift:", e);
    }
  };

  const updateJob = async (id: number, updates: Partial<Omit<Job, "id">>) => {
    try {
      const result = await drizzleDb
        .update(job)
        .set(updates)
        .where(eq(job.id, id))
        .returning();

      if (result && result.length > 0) {
        return result[0];
      }
      // Handle case where update didn't affect any rows (e.g., ID not found)
      console.warn(`Job with ID ${id} not found for update.`);
    } catch (e) {
      console.error("Failed to update job:", e);
    }
  };

  const deleteShift = async (id: number) => {
    try {
      await drizzleDb.delete(shift).where(eq(shift.id, id));
    } catch (e) {
      console.error("Failed to delete shift:", e);
    }
  };

  const deleteJob = async (id: number) => {
    try {
      await drizzleDb.delete(job).where(eq(job.id, id));
    } catch (e) {
      console.error("Failed to delete job:", e);
    }
  };

  const deletePaycycle = async (id: number) => {
    try {
      await drizzleDb.delete(paycycle).where(eq(paycycle.id, id));
    } catch (e) {
      console.error("Failed to delete job:", e);
    }
  };

  return (
    <DataContext.Provider
      value={{
        jobs,
        migrationError,
        isMigrating,
        isSyncing,
        toggleSync,
        createShift,
        createJob,
        createPaycycle,
        updateShift,
        updateJob,
        deleteShift,
        deleteJob,
        deletePaycycle,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export function useData() {
  // Rename hook if context is renamed
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
