CREATE TABLE `googleSheetsSync` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`recordType` varchar(50) NOT NULL,
	`recordId` int NOT NULL,
	`spreadsheetId` varchar(255) NOT NULL,
	`sheetName` varchar(255) NOT NULL,
	`rowNumber` int,
	`synced` int NOT NULL DEFAULT 0,
	`lastSyncAttempt` timestamp,
	`syncError` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `googleSheetsSync_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `occurrences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`occurrenceType` varchar(100) NOT NULL,
	`location` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`agentName` varchar(255) NOT NULL,
	`registeredAt` timestamp NOT NULL,
	`syncedToSheets` int NOT NULL DEFAULT 0,
	`sheetsRowId` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `occurrences_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`reportType` varchar(100) NOT NULL,
	`periodStart` timestamp NOT NULL,
	`periodEnd` timestamp NOT NULL,
	`generatedAt` timestamp NOT NULL,
	`totalVehicles` int DEFAULT 0,
	`totalOccurrences` int DEFAULT 0,
	`activeAgents` int DEFAULT 0,
	`syncedToSheets` int NOT NULL DEFAULT 0,
	`sheetsRowId` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vehicles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`agentName` varchar(255) NOT NULL,
	`vehicleId` varchar(100) NOT NULL,
	`openingKm` int NOT NULL,
	`registeredAt` timestamp NOT NULL,
	`observations` text,
	`syncedToSheets` int NOT NULL DEFAULT 0,
	`sheetsRowId` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vehicles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `googleSheetsSync` ADD CONSTRAINT `googleSheetsSync_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `occurrences` ADD CONSTRAINT `occurrences_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reports` ADD CONSTRAINT `reports_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vehicles` ADD CONSTRAINT `vehicles_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;