ALTER TABLE `shift` RENAME COLUMN `punch_in_time` TO `start_time`;--> statement-breakpoint
ALTER TABLE `shift` RENAME COLUMN `punch_out_time` TO `end_time`;