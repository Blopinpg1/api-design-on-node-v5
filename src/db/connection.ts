import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema.ts'
import { env, isProd } from '../../env.ts'
import { remember } from '@epic-web/remember'

/*
|--------------------------------------------------------------------------
| Create a new PostgreSQL connection pool
| The Pool manages multiple database connections efficiently.
|--------------------------------------------------------------------------
*/
const createPool = () => {
  return new Pool({
    connectionString: env.DATABASE_URL, // Use DATABASE_URL from environment variables
  })
}

/*
|--------------------------------------------------------------------------
| Client Initialization
| Choose between production and development setup.
|--------------------------------------------------------------------------
*/
let client

if (isProd()) {
  /*
    Production:
    - Simply create a new pool.
    - No hot-reload issues in production.
  */
  client = createPool()
} else {
  /*
    Development:
    - Use 'remember' to cache the pool in memory.
    - Prevents creating multiple pools on hot-reloads (common with ts-node-dev, Next.js, etc.)
  */
  client = remember('dbPool', () => createPool())
}

/*
|--------------------------------------------------------------------------
| Initialize Drizzle ORM
| - Connect Drizzle to PostgreSQL using the client.
| - Attach the schema for table definitions and type inference.
|--------------------------------------------------------------------------
*/
export const db = drizzle({ client, schema })

/*
|--------------------------------------------------------------------------
| Export default
| Now any file can import `db` to run queries:
| import db from './db'
|--------------------------------------------------------------------------
*/
export default db
