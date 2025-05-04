PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_job` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`overtime_threshold_minutes` integer DEFAULT 2400 NOT NULL,
	`overtime_period_days` integer DEFAULT 7 NOT NULL,
	`break_duration_minutes` integer DEFAULT 30 NOT NULL,
	`paycycle_days` integer DEFAULT 14 NOT NULL,
	`min_shift_duration_minutes` integer DEFAULT 180 NOT NULL,
	`timezone` text DEFAULT 'America/Toronto' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_job`("id", "name", "description", "overtime_threshold_minutes", "overtime_period_days", "break_duration_minutes", "paycycle_days", "min_shift_duration_minutes", "timezone") SELECT "id", "name", "description", "overtime_threshold_minutes", "overtime_period_days", "break_duration_minutes", "paycycle_days", "min_shift_duration_minutes", "timezone" FROM `job`;--> statement-breakpoint
DROP TABLE `job`;--> statement-breakpoint
ALTER TABLE `__new_job` RENAME TO `job`;--> statement-breakpoint
PRAGMA foreign_keys=ON;