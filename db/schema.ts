import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const job = sqliteTable("job", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  overtimeThresholdMinutes: integer("overtime_threshold_minutes")
    .notNull()
    .default(2400),
  overtimePeriodDays: integer("overtime_period_days").notNull().default(7),
  breakDurationMins: integer("break_duration_minutes").notNull().default(30),
  paycycleDays: integer("paycycle_days").notNull().default(14),
  minShiftDurationMinutes: integer("min_shift_duration_minutes")
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
  // Stored as PlainDate for simplicity
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
});

export const shift = sqliteTable("shift", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  paycycleId: integer("paycycle_id")
    .references(() => paycycle.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .notNull(),
  // Stored as Instant for simplicity
  startTime: text("start_time").notNull(),
  endTime: text("end_time"),
  notes: text("notes"),
  isEdited: integer("is_edited", { mode: "boolean" }).notNull(),
});

export type Job = typeof job.$inferSelect;
export type NewJob = typeof job.$inferInsert;

export type Paycycle = typeof paycycle.$inferSelect;
export type NewPaycycle = typeof paycycle.$inferInsert;

export type Shift = typeof shift.$inferSelect;
export type NewShift = typeof shift.$inferInsert;
