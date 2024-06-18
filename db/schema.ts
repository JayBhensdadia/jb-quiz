import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";


// Users table
export const users = sqliteTable("users", {
    id: integer("id").primaryKey({ autoIncrement: true, onConflict: 'abort' }),
    username: text("username").notNull().unique(),
    password: text("password").notNull(),
    createdAt: text("created_at")
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
});

// Questions table
export const questions = sqliteTable("questions", {
    id: integer("id").primaryKey({ autoIncrement: true, onConflict: 'abort' }),
    questionText: text("question_text").notNull(),
    options: text("options").notNull(),  // JSON string representing an array of options
    correctOption: text("correct_option").notNull(),  // Correct option as a string
    createdAt: text("created_at")
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
});

export type SelectUser = typeof users.$inferSelect;
export type SelectQuestion = typeof questions.$inferSelect;