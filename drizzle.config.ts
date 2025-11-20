import { defineConfig } from 'drizzle-kit'
import { env } from './env.ts'

/**
 * --------------------------------------------------------
 * Drizzle Kit Configuration
 * --------------------------------------------------------
 * This file configures Drizzle Kit for database migrations
 * and schema management.
 */
export default defineConfig({
  /**
   * Path to your database schema file.
   * Drizzle reads this file to understand table definitions,
   * relations, and types.
   */
  schema: './src/db/schema.ts',

  /**
   * Directory where migration files will be generated.
   * Each migration corresponds to a schema change.
   */
  out: './migrations',

  /**
   * Database dialect
   * ----------------
   * Currently using PostgreSQL. Drizzle supports other dialects
   * like MySQL, SQLite, etc.
   */
  dialect: 'postgresql',

  /**
   * Database credentials
   * -------------------
   * Using DATABASE_URL from your environment variables.
   * Drizzle will use this URL to connect to the database
   * when creating or running migrations.
   */
  dbCredentials: {
    url: env.DATABASE_URL,
  },

  /**
   * Verbose logging
   * ----------------
   * Shows detailed logs when generating or running migrations.
   * Useful for debugging migration issues.
   */
  verbose: true,

  /**
   * Strict mode
   * ------------
   * Enforces strict schema rules.
   * Ensures migrations match the schema exactly, helping catch
   * inconsistencies early.
   */
  strict: true,
})
