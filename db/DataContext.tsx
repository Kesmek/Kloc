import { drizzle } from "drizzle-orm/expo-sqlite";
import { eq, desc, and, isNull } from "drizzle-orm";
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
  type PaycycleStatistics,
  type Shift,
  job,
  paycycle,
  shift,
} from "./schema";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "./migrations/migrations";
import Constants from "expo-constants";

export const DATABASE_NAME = "shiftly.db";
//
// In your db/DataContext.ts or wherever tursoOptions is defined
export const tursoOptions = {
  url: Constants.expoConfig?.extra?.tursoUrl as string,
  authToken: Constants.expoConfig?.extra?.tursoAuthToken as string,
};

// Add checks to ensure they exist if needed
if (!tursoOptions.url || !tursoOptions.authToken) {
  throw new Error(
    "Turso configuration is missing in Constants.expoConfig.extra!",
  );
}

interface DataContextType {
  createShift: (
    // id is auto generated and can be omitted
    newShiftData: Omit<NewShift, "id">,
  ) => Promise<Shift | undefined>;
  updateShift: (
    id: number,
    updatedShiftData: Partial<Omit<Shift, "id">>,
  ) => Promise<Shift | undefined>;
  deleteShift: (id: number) => Promise<Shift | undefined>;
  createPaycycle: (
    // id is auto generated and can be omitted
    newPaycycleData: Omit<NewPaycycle, "id">,
  ) => Promise<Paycycle | undefined>;
  deletePaycycle: (id: number) => Promise<Paycycle | undefined>;
  jobs: Job[];
  createJob: (
    // id is auto generated and can be omitted
    newJobData: Omit<NewJob, "id">,
  ) => Promise<Job | undefined>;
  updateJob: (
    id: number,
    updatedJobData: Partial<Omit<Job, "id">>,
  ) => Promise<Job | undefined>;
  deleteJob: (id: number) => Promise<Job | undefined>;
  fetchJobs: () => Promise<Job[]>;
  fetchShifts: (paycycleId: number) => Promise<Shift[]>;
  fetchPaycycles: (jobId: number) => Promise<Paycycle[]>;
  fetchPaycycleStatsById: (
    jobId: number,
    paycycleId: number,
  ) => Promise<PaycycleStatistics | undefined>;
  isMigrating: boolean;
  migrationError: Error | undefined;
  isSyncing: boolean;
  syncData: () => void;
  toggleSync: (enabled: boolean) => void;
  findLastShiftContext: () => Promise<
    { jobId: number; paycycleId: number } | undefined
  >;
  getShiftById: (id: number) => Promise<Shift | undefined>;
  getJobById: (id: number) => Promise<Job | undefined>;
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

  const { success, error } = useMigrations(drizzleDb, migrations);

  // --- Fetch initial data using Drizzle ---
  const fetchJobs = useCallback(async () => {
    let result: Job[] = [];
    try {
      // Use Drizzle's select syntax
      result = await drizzleDb.query.job.findMany();
      setJobs(result);
      return result;
    } catch (e) {
      console.error("Failed to fetch jobs:", e);
    }
    return result;
  }, [drizzleDb]);

  const fetchPaycycles = useCallback(
    async (jobId: number) => {
      let result: Paycycle[] = [];
      try {
        // Use Drizzle's select syntax
        result = await drizzleDb.query.paycycle.findMany({
          where: eq(paycycle.jobId, jobId),
          orderBy: desc(paycycle.startDate),
        });
      } catch (e) {
        console.error("Failed to fetch jobs:", e);
      }
      return result;
    },
    [drizzleDb],
  );

  const fetchPaycycleStatsById = useCallback(
    async (jobId: number, paycycleId: number) => {
      let result: PaycycleStatistics[] | undefined;
      try {
        // Use Drizzle's select syntax
        result = await drizzleDb
          .select({
            jobId: job.id,
            name: job.name,
            overtimeThresholdMinutes: job.overtimeThresholdMinutes,
            description: job.description,
            breakDurationMinutes: job.breakDurationMinutes,
            minShiftDurationMinutes: job.minShiftDurationMinutes,
            overtimePeriodDays: job.overtimePeriodDays,
            paycycleDays: job.paycycleDays,
            paycycleId: paycycle.id,
            startDate: paycycle.startDate,
            endDate: paycycle.endDate,
            timezone: job.timezone,
          })
          .from(paycycle)
          .innerJoin(job, eq(paycycle.jobId, job.id))
          .where(and(eq(paycycle.id, paycycleId), eq(job.id, jobId)))
          .limit(1);

        return result[0];
      } catch (e) {
        console.error("Failed to fetch paycycle stats:", e);
      }
    },
    [drizzleDb],
  );

  const fetchShifts = useCallback(
    async (paycycleId: number) => {
      let result: Shift[] = [];
      try {
        // Use Drizzle's select syntax
        result = await drizzleDb.query.shift.findMany({
          where: eq(shift.paycycleId, paycycleId),
          orderBy: desc(shift.startTime),
        });
      } catch (e) {
        console.error("Failed to fetch jobs:", e);
      }
      return result;
    },
    [drizzleDb],
  );

  // Initial fetch effect
  useEffect(() => {
    //setIsMigrating(true); // Let's rely on success/error states primarily

    if (error) {
      console.error("Migration Hook Error:", error); // Log the specific error
      setMigrationError(error);
      setIsMigrating(false); // Hook finished (with error)
    } else if (success) {
      setIsMigrating(false); // Hook finished (successfully)
      setMigrationError(undefined);
      console.log("Migration Hook Success.");
    } else {
      // Neither success nor error yet - migration in progress or not started
      setIsMigrating(true);
    }
  }, [success, error]);

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
    } catch (e) {
      console.error("Sync failed:", e);
    }
  }, [expoDb]); // Include all fetch functions

  // Toggle sync remains the same, using syncData
  const toggleSync = useCallback(
    async (enabled: boolean) => {
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
      return (
        await drizzleDb.delete(shift).where(eq(shift.id, id)).returning()
      )[0];
    } catch (e) {
      console.error("Failed to delete shift:", e);
    }
  };

  const deleteJob = async (id: number) => {
    try {
      return (await drizzleDb.delete(job).where(eq(job.id, id)).returning())[0];
    } catch (e) {
      console.error("Failed to delete job:", e);
    }
  };

  const deletePaycycle = async (id: number) => {
    try {
      return (
        await drizzleDb.delete(paycycle).where(eq(paycycle.id, id)).returning()
      )[0];
    } catch (e) {
      console.error("Failed to delete job:", e);
    }
  };

  const findLastShiftContext = async () => {
    const lastShiftInfo = await drizzleDb
      .select({
        jobId: paycycle.jobId,
        paycycleId: shift.paycycleId,
      })
      .from(shift)
      .innerJoin(paycycle, eq(shift.paycycleId, paycycle.id))
      .where(isNull(shift.endTime))
      .orderBy(desc(shift.startTime))
      .limit(1);

    return lastShiftInfo[0]; // Returns { jobId, paycycleId } or undefined
  };

  const getShiftById = async (id: number) => {
    return await drizzleDb.query.shift.findFirst({
      where: eq(shift.id, id),
    });
  };

  const getJobById = async (id: number) => {
    return await drizzleDb.query.job.findFirst({
      where: eq(job.id, id),
    });
  };

  return (
    <DataContext.Provider
      value={{
        jobs,
        migrationError,
        isMigrating,
        isSyncing,
        toggleSync,
        syncData,
        createShift,
        createJob,
        createPaycycle,
        updateShift,
        updateJob,
        deleteShift,
        deleteJob,
        deletePaycycle,
        findLastShiftContext,
        fetchJobs,
        fetchPaycycles,
        fetchPaycycleStatsById,
        fetchShifts,
        getShiftById,
        getJobById,
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
