import { db } from './connection.ts'
import { users, habits, entries, tags, habitTags } from './schema.ts'

/*
|--------------------------------------------------------------------------
| Seed Script
|--------------------------------------------------------------------------
| This script inserts demo data into the database.
| It helps during development by giving you ready-made:
|   - users
|   - habits
|   - tags
|   - habit entries (completion logs)
|   - habit-tag relationships
|
| Why seeds matter:
| - You get instant test data after running migrations.
| - Helps frontend developers test UI without creating accounts.
| - Ensures consistent sample data for demos/testing.
|--------------------------------------------------------------------------
*/

const seed = async () => {
  console.log('🌱 Starting database seed...')

  try {
    /*
    |--------------------------------------------------------------------------
    | 1. Clear Existing Data
    | Delete order matters due to foreign-key constraints.
    |--------------------------------------------------------------------------
    */
    console.log('Clearing existing data...')
    await db.delete(entries)
    await db.delete(habitTags)
    await db.delete(habits)
    await db.delete(tags)
    await db.delete(users)

    /*
    |--------------------------------------------------------------------------
    | 2. Create a Demo User
    | This user will own all demo habits.
    |--------------------------------------------------------------------------
    */
    console.log('Creating demo users...')
    const [demoUser] = await db
      .insert(users)
      .values({
        username: 'demo_user',
        email: 'dem@app.com',
        password: 'hashed_demo_password', // Normally hashed
        firstName: 'Demo',
        lastName: 'User',
      })
      .returning()

    /*
    |--------------------------------------------------------------------------
    | 3. Create Tags
    |--------------------------------------------------------------------------
    */
    console.log('Creating tags...')
    const [healthTag] = await db
      .insert(tags)
      .values({ name: 'Health', color: '#34D399' })
      .returning()

    /*
    |--------------------------------------------------------------------------
    | 4. Create Habits
    | A habit belongs to the demo user.
    |--------------------------------------------------------------------------
    */
    const [exerciseHabit] = await db
      .insert(habits)
      .values({
        userId: demoUser.id,
        name: 'Exercise',
        description: 'Daily morning exercise routine',
        frequency: 'daily',
        targetCount: 1,
      })
      .returning()

    /*
    |--------------------------------------------------------------------------
    | 5. Link Habit With Tag (Many-to-Many)
    | habitTags connects "exercise" with "health".
    |--------------------------------------------------------------------------
    */
    await db.insert(habitTags).values({
      habitId: exerciseHabit.id,
      tagId: healthTag.id,
    })

    /*
    |--------------------------------------------------------------------------
    | 6. Insert Completion Entries (Past 7 Days)
    |--------------------------------------------------------------------------
    */
    console.log('Adding completion entries...')
    const today = new Date()
    today.setHours(12, 0, 0, 0)

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

    /*
    |--------------------------------------------------------------------------
    | Done!
    |--------------------------------------------------------------------------
    */
    console.log('✅ Database seed completed!')
    console.log('User credentials:')
    console.log(`Email: ${demoUser.email}`)
    console.log(`Username: ${demoUser.username}`)
    console.log(`Password: ${demoUser.password}`)
  } catch (e) {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  }
}

/*
|--------------------------------------------------------------------------
| Run seed if file is executed directly (node seed.ts)
|--------------------------------------------------------------------------
*/
if (import.meta.url === `file://${process.argv[1]}`) {
  seed()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}

export default seed
