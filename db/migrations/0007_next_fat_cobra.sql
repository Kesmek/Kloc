PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_shift` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`paycycle_id` integer NOT NULL,
	`start_time` text NOT NULL,
	`end_time` text,
	`notes` text,
	`break_duration_minutes` integer DEFAULT 30 NOT NULL,
	`is_edited` integer NOT NULL,
	FOREIGN KEY (`paycycle_id`) REFERENCES `paycycle`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_shift`("id", "paycycle_id", "start_time", "end_time", "notes", "break_duration_minutes", "is_edited") SELECT "id", "paycycle_id", "start_time", "end_time", "notes", "break_duration_minutes", "is_edited" FROM `shift`;--> statement-breakpoint
DROP TABLE `shift`;--> statement-breakpoint
ALTER TABLE `__new_shift` RENAME TO `shift`;--> statement-breakpoint
PRAGMA foreign_keys=ON;