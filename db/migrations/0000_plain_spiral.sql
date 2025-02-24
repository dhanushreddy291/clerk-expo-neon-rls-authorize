CREATE TABLE "todos" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text,
	"completed" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now(),
	"user_id" text
);
