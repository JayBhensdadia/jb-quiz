import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite/next";
import * as schema from './schema';

const expo = openDatabaseSync("jb-quiz-3.db", { enableChangeListener: true });
export const db = drizzle(expo, { schema });