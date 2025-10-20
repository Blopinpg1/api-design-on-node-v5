import { db } from './connection.ts'
import { users, habits, entries, tags, habitTags } from './schema.ts'

const seed = async () => {
  console.log('🌱 Starting database seed....')

  try {
    console.log('Clearing existing data...')
    await db.delete(entries)
    await db.delete(habitTags)
    await db.delete(habits)
    await db.delete(tags)
    await db.delete(users)

    console.log('creating demo users...')
    const [demoUser] = await db
      .insert(users)
      .values({
        username: 'demo_user',
        email: 'dem@app.com',
        password: 'hashed_demo_password',
        firstName: 'Demo',
        lastName: 'User',
      })
      .returning()
    console.log('Creating tags...')
    const [healthTag] = await db
      .insert(tags)
      .values({ name: 'Health', color: '#34D399' })
      .returning()

    const [exerciseHabit] = await db
      .insert(habits)
      .values({
        userId: demoUser.id,
        name: ' Exercise',
        description: 'Daily morning exercise routine',
        frequency: 'daily',
        targetCount: 1,
      })
      .returning()

    await db.insert(habitTags).values({
      habitId: exerciseHabit.id,
      tagId: healthTag.id,
    })
    console.log('Adding completions entries....')
    const today = new Date()
    today.setHours(12, 0, 0, 0)

    // Exercise habit - completions for past 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      await db.insert(entries).values([
        {
          habitId: exerciseHabit.id,
          completionDate: date,
          note: i === 0 ? 'Great workout today!' : null,
        },
      ])
    }
    console.log('✅ Database seeded completed!')
    console.log('user credentials:')
    console.log(`Email: ${demoUser.email}`)
    console.log(`username: ${demoUser.username}`)
    console.log(`password: ${demoUser.password}`)
  } catch (e) {
    console.error('❌seed failed:', e)
    process.exit(1)
  }
}

// Run seed if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seed()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}

export default seed
