import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-zod';

export const todos = pgTable('todos', {
    id: serial('id').primaryKey(),
    title: text('title'),
    completed: text('completed'),
    created_at: timestamp("created_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true })
        .defaultNow()
        .$onUpdate(() => new Date()),
    user_id: text('user_id'),
});

export const todoSelectSchema = createSelectSchema(todos);
