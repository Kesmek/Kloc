import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const job = sqliteTable("job", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  overtimeBoundaryMins: integer("overtime_boundary_mins")
    .notNull()
    .default(2400),
  overtimePeriod: integer("overtime_period").notNull().default(1),
  breakDurationMins: integer("break_duration_mins").notNull().default(30),
  paycycleDays: integer("paycycle_days").notNull().default(14),
  minShiftDurationMins: integer("min_shift_duration_mins")
    .notNull()
    .default(180),
});

export const paycycle = sqliteTable("paycycle", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  jobId: integer("job_id")
    .references(() => job.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .notNull(),
  startDate: text("start_date").notNull(),
});

export const shift = sqliteTable("shift", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  jobId: integer("job_id")
    .references(() => job.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .notNull(),
  paycycleId: integer("paycycle_id")
    .references(() => paycycle.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time"),
  duration: text("duration"),
  notes: text("notes"),
  edited: integer("edited", { mode: "boolean" }).notNull(),
});

export type SelectJobs = typeof job.$inferSelect;
export type SelectShift = typeof shift.$inferSelect;
export type InsertShift = typeof shift.$inferInsert;
export type SelectPaycycle = typeof paycycle.$inferSelect;
