CREATE TABLE `job` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`overtime_boundary_mins` integer DEFAULT 2400 NOT NULL,
	`overtime_period` integer DEFAULT 1 NOT NULL,
	`break_duration_mins` integer DEFAULT 30 NOT NULL,
	`paycycle_days` integer DEFAULT 14 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `paycycle` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`job_id` integer NOT NULL,
	`start_date` text NOT NULL,
	FOREIGN KEY (`job_id`) REFERENCES `job`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `shift` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`job_id` integer NOT NULL,
	`paycycle_id` integer NOT NULL,
	`punch_in_time` text NOT NULL,
	`punch_out_time` text,
	`duration` text,
	`notes` text,
	`edited` integer NOT NULL,
	FOREIGN KEY (`job_id`) REFERENCES `job`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`paycycle_id`) REFERENCES `paycycle`(`id`) ON UPDATE cascade ON DELETE cascade
);
