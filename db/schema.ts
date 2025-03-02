import { createSelectSchema } from 'drizzle-zod';
import { pgPolicy, pgTable, text, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { InferSelectModel, sql } from "drizzle-orm";

export const todos = pgTable(
    'todos', {
    id: integer("id")
        .primaryKey()
        .generatedByDefaultAsIdentity(),
    userId: text("user_id")
        .notNull()
        .default(sql`(auth.user_id())`),
    title: text('title').notNull(),
    completed: boolean('completed').notNull().default(false),
    created_at: timestamp("created_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true })
        .defaultNow()
        .$onUpdate(() => new Date())
}, (t) => [
    pgPolicy("create todos", {
        for: "insert",
        to: "authenticated",
        withCheck: sql`(select auth.user_id() = user_id)`,
    }),

    pgPolicy("view todos", {
        for: "select",
        to: "authenticated",
        using: sql`(select auth.user_id() = user_id)`,
    }),

    pgPolicy("update todos", {
        for: "update",
        to: "authenticated",
        using: sql`(select auth.user_id() = user_id)`,
    }),

    pgPolicy("delete todos", {
        for: "delete",
        to: "authenticated",
        using: sql`(select auth.user_id() = user_id)`,
    }),
]
);

export const todoSelectSchema = createSelectSchema(todos);

export type Todo = InferSelectModel<typeof todos>;
