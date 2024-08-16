import Database from "better-sqlite3";
import type { Database as TDatabase } from "better-sqlite3";
import path from "path";

const setupDb = (db?: TDatabase): TDatabase => {
  if (!process.env.DB_LOCAL_PATH) throw new Error("DB_LOCAL_PATH not set");
  if (!db) {
    // If the database instance is not initialized, open the database connection
    return new Database(path.join(process.cwd(), process.env.DB_LOCAL_PATH), {
      verbose: console.log,
    });
  }
  return db;
};

const db = setupDb();

export default db;
