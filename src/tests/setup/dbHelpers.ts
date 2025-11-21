import { db } from '../../db/connection.ts'
import { users, habits, entries } from '../../db/schema.ts'
import { hashPassword } from '../../utils/password.ts'
import { generateToken } from '../../utils/jwt.ts'

export async function createTestUser(
  userData: Partial<{
    email: string
    username: string
    password: string
    firstName: string
    lastName: string
  }> = {}
) {
  const defaultData = {
    email: `test-${Date.now()}-${Math.random()}@example.com`,
    username: `testuser-${Date.now()}-${Math.random()}`,
    password: 'TestPassword123!',
    firstName: 'Test',
    lastName: 'User',
    ...userData,
  }

  const hashedPassword = await hashPassword(defaultData.password)
  const [user] = await db
    .insert(users)
    .values({
      ...defaultData,
      password: hashedPassword,
    })
    .returning()

  const token = await generateToken({
    id: user.id,
    email: user.email,
    username: user.username,
  })

  return { user, token, rawPassword: defaultData.password }
}

export async function createTestHabit(
  userId: string,
  habitData: Partial<{
    name: string
    description: string
    frequency: string
    targetCount: number
  }> = {}
) {
  const defaultData = {
    name: `Test Habit ${Date.now()}`,
    description: 'A test habit',
    frequency: 'daily',
    targetCount: 1,
    ...habitData,
  }

  const [habit] = await db
    .insert(habits)
    .values({
      userId,
      ...defaultData,
    })
    .returning()

  return habit
}

export async function cleanupDatabase() {
  // Clean up in the right order due to foreign key constraints
  await db.delete(entries)
  await db.delete(habits)
  await db.delete(users)
}
