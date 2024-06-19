CREATE TABLE `quiz_results` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`question_id` integer NOT NULL,
	`selected_option` text NOT NULL,
	`is_correct` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `users` ADD `name` text DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `users` ADD `profile_photo` text DEFAULT 'https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001882.png';