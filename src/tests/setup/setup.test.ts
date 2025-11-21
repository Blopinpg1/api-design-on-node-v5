import {
  createTestUser,
  createTestHabit,
  cleanupDatabase,
} from './dbHelpers.ts'

describe(' Test setup', () => {
  test('should be connected to test database', async () => {
    const { user, token } = await createTestUser()
    expect(user).toBeDefined()
    await cleanupDatabase()
  })
})
