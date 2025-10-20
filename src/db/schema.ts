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

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 256 }).notNull().unique(),
  username: varchar('name', { length: 50 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(), // hashed password
  firstName: varchar('first_name', { length: 50 }),
  lastName: varchar('last_name', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updateAt: timestamp('updated_at').defaultNow().notNull(),
})

export const habits = pgTable('habits', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  frequency: varchar('frequency', { length: 20 }).notNull(), // e.g., daily, weekly
  targetCount: integer('target_count').default(1).notNull(), // e.g., 1 time per day
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const entries = pgTable('entries', {
  id: uuid('id').defaultRandom().primaryKey(),
  habitId: uuid('habit_id')
    .references(() => habits.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  completionDate: timestamp('completion_date').defaultNow().notNull(),
  note: text('note'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const tags = pgTable('tags', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 50 }).notNull(),
  color: varchar('color', { length: 7 }).default('#6b7280'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updateAt: timestamp('updated_at').defaultNow().notNull(),
})

export const habitTags = pgTable('habit_tags', {
  id: uuid('id').defaultRandom().primaryKey(),
  habitId: uuid('habit_id')
    .references(() => habits.id, { onDelete: 'cascade' })
    .notNull(),
  tagId: uuid('tag_id')
    .references(() => tags.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updateAt: timestamp('updated_at').defaultNow().notNull(),
})

export const userRelations = relations(users, ({ many }) => ({
  habits: many(habits),
}))

export const habitRelations = relations(habits, ({ one, many }) => ({
  user: one(users, { fields: [habits.userId], references: [users.id] }),
  entries: many(entries),
  habitTags: many(habitTags),
}))

export const extriesRelations = relations(entries, ({ one }) => ({
  habit: one(habits, { fields: [entries.habitId], references: [habits.id] }),
}))

export const tagRelations = relations(tags, ({ many }) => ({
  habitTags: many(habitTags),
}))

export const habitTagRelations = relations(habitTags, ({ one }) => ({
  habit: one(habits, { fields: [habitTags.habitId], references: [habits.id] }),
  tag: one(tags, { fields: [habitTags.tagId], references: [tags.id] }),
}))

export type User = typeof users.$inferSelect
export type Habit = typeof habits.$inferSelect
export type Entry = typeof entries.$inferSelect
export type Tag = typeof tags.$inferSelect
export type HabitTag = typeof habitTags.$inferSelect

export const insertUserSchema = createInsertSchema(users)
export const selectUserSchema = createSelectSchema(users)
export const insertHabitSchema = createInsertSchema(habits)
