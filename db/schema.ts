import { sql } from "drizzle-orm";
import { binary } from "drizzle-orm/mysql-core";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";


// Users table
export const users = sqliteTable("users", {
    id: integer("id").primaryKey({ autoIncrement: true, onConflict: 'abort' }),
    username: text("username").notNull().unique(),
    password: text("password").notNull(),
    name: text('name').default('user'),
    profilePhoto: text('profile_photo').default('https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001882.png'),
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

// // Quiz Attempts table
// export const quizAttempts = sqliteTable("quiz_attempts", {
//     id: integer("id").primaryKey(),
//     userId: integer("user_id")
//         .references(() => users.id)
//         .notNull(),
//     createdAt: text("created_at")
//         .default(sql`CURRENT_TIMESTAMP`)
//         .notNull(),

// });

// Quiz Results table
export const quizResults = sqliteTable("quiz_results", {
    id: integer("id").primaryKey(),

    userId: integer("user_id").references(() => users.id).notNull(),
    // attemptId: integer("attempt_id")
    //     .references(() => quizAttempts.id)
    //     .notNull(),
    questionId: integer("question_id")
        .references(() => questions.id)
        .notNull(),
    selectedOption: text('selected_option').notNull(),
    isCorrect: integer("is_correct", { mode: 'boolean' }).notNull(),
    createdAt: text("created_at")
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),

});

export type SelectUser = typeof users.$inferSelect;
export type SelectQuestion = typeof questions.$inferSelect;
// export type SelectQuizAttempt = typeof quizAttempts.$inferSelect;
export type SelectQuizResult = typeof quizResults.$inferSelect;

