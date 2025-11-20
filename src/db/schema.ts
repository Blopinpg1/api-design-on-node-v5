import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

/*
|--------------------------------------------------------------------------
| Users Table
| Stores all user account information.
|--------------------------------------------------------------------------
*/
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(), // Primary key UUID
  email: varchar('email', { length: 256 }).notNull().unique(), // Unique email
  username: varchar('name', { length: 50 }).notNull().unique(), // Unique username
  password: varchar('password', { length: 255 }).notNull(), // Hashed password
  firstName: varchar('first_name', { length: 50 }), // Optional first name
  lastName: varchar('last_name', { length: 50 }), // Optional last name
  createdAt: timestamp('created_at').defaultNow().notNull(), // Record creation time
  updateAt: timestamp('updated_at').defaultNow().notNull(), // Record update time
})

/*
|--------------------------------------------------------------------------
| Habits Table
| Each habit belongs to a user.
| Stores habit metadata such as frequency and target counts.
|--------------------------------------------------------------------------
*/
export const habits = pgTable('habits', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }) // FK → users.id
    .notNull(),
  name: varchar('name', { length: 100 }).notNull(), // Habit name
  description: text('description'), // Optional description
  frequency: varchar('frequency', { length: 20 }).notNull(), // e.g., daily, weekly
  targetCount: integer('target_count').default(1).notNull(), // e.g., 1 time/day
  isActive: boolean('is_active').default(true).notNull(), // Soft delete flag
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

/*
|--------------------------------------------------------------------------
| Entries Table
| Logs each completion of a habit.
| One entry = one habit completion event.
|--------------------------------------------------------------------------
*/
export const entries = pgTable('entries', {
  id: uuid('id').defaultRandom().primaryKey(),
  habitId: uuid('habit_id')
    .references(() => habits.id, { onDelete: 'cascade' }) // FK → habits.id
    .notNull(),
  completionDate: timestamp('completion_date').defaultNow().notNull(), // When habit was completed
  note: text('note'), // Optional note
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

/*
|--------------------------------------------------------------------------
| Tags Table
| Tags allow organizing habits into categories (e.g., Fitness, Health).
|--------------------------------------------------------------------------
*/
export const tags = pgTable('tags', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 50 }).notNull(), // Tag name
  color: varchar('color', { length: 7 }).default('#6b7280'), // HEX color
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updateAt: timestamp('updated_at').defaultNow().notNull(),
})

/*
|--------------------------------------------------------------------------
| HabitTags Table (Many-to-Many)
| Connects habits with tags.
| A habit can have many tags; a tag can be used on many habits.
|--------------------------------------------------------------------------
*/
export const habitTags = pgTable('habit_tags', {
  id: uuid('id').defaultRandom().primaryKey(),
  habitId: uuid('habit_id')
    .references(() => habits.id, { onDelete: 'cascade' })
    .notNull(), // FK to habit
  tagId: uuid('tag_id')
    .references(() => tags.id, { onDelete: 'cascade' })
    .notNull(), // FK to tag
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updateAt: timestamp('updated_at').defaultNow().notNull(),
})

/*
|--------------------------------------------------------------------------
| Relations
| Defines how tables connect (one-to-many & many-to-many).
| Used by Drizzle for relational queries with .query.*
|--------------------------------------------------------------------------
*/

export const userRelations = relations(users, ({ many }) => ({
  habits: many(habits), // A user has many habits
}))

export const habitRelations = relations(habits, ({ one, many }) => ({
  user: one(users, {
    // A habit belongs to one user
    fields: [habits.userId],
    references: [users.id],
  }),
  entries: many(entries), // A habit has many completion entries
  habitTags: many(habitTags), // A habit has many tag connections
}))

export const extriesRelations = relations(entries, ({ one }) => ({
  habit: one(habits, {
    // Entry belongs to a habit
    fields: [entries.habitId],
    references: [habits.id],
  }),
}))

export const tagRelations = relations(tags, ({ many }) => ({
  habitTags: many(habitTags), // A tag is used on many habits
}))

export const habitTagRelations = relations(habitTags, ({ one }) => ({
  habit: one(habits, {
    // habit_tags → habit
    fields: [habitTags.habitId],
    references: [habits.id],
  }),
  tag: one(tags, {
    // habit_tags → tag
    fields: [habitTags.tagId],
    references: [tags.id],
  }),
}))

/*
|--------------------------------------------------------------------------
| TypeScript Inferred Types
| $inferSelect → type of rows returned from SELECT
| $inferInsert → type required when inserting new rows
|--------------------------------------------------------------------------
*/
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Habit = typeof habits.$inferSelect
export type Entry = typeof entries.$inferSelect
export type Tag = typeof tags.$inferSelect
export type HabitTag = typeof habitTags.$inferSelect

/*
|--------------------------------------------------------------------------
| Zod Schemas (drizzle-zod)
| Automatically generate Zod validation schemas based on table structure.
| insertSchema → for validating POST/INSERT input (req.body)
| selectSchema → for validating API responses or read queries
|--------------------------------------------------------------------------
*/
export const insertUserSchema = createInsertSchema(users)
export const selectUserSchema = createSelectSchema(users)
export const insertHabitSchema = createInsertSchema(habits)

// ┌─────────────┐
// │   users     │
// │-------------│
// │ id          │
// │ email       │
// │ username    │
// └───────┬─────┘
//         │ 1-to-many
//         │
//         ▼
// ┌─────────────┐
// │   habits    │
// │-------------│
// │ id          │
// │ userId -----┼──────────▶ users.id
// │ name        │
// └───────┬─────┘
//         │ 1-to-many
//         │
//         ▼
// ┌─────────────┐
// │   entries   │
// │-------------│
// │ id          │
// │ habitId ----┼──────────▶ habits.id
// │ date        │
// └─────────────┘

// ┌─────────────┐        ┌─────────────┐
// │    tags     │        │ habitTags   │
// │-------------│        │-------------│
// │ id          │◀────┐  │ habitId ----┼─▶ habits.id
// │ name        │     └──│ tagId ------┼─▶ tags.id
// └─────────────┘        └─────────────┘

// Notes:
// - The habitTags table acts as a bridge to connect habits and tags.
// - This enables a Many-to-Many relationship:
//      A habit can have many tags.
//      A tag can apply to many habits.
// - Drizzle uses these relations to allow queries like:
//      db.query.habits.findMany({ with: { tags: true } })
