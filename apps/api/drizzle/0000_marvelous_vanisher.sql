CREATE TABLE IF NOT EXISTS "sounds" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"author" text NOT NULL,
	"url" text NOT NULL
);
