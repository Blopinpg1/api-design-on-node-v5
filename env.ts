import { env as loadEnv } from 'custom-env'
import { z } from 'zod'

/**
 * --------------------------------------------------------
 * Determine the current application stage
 * --------------------------------------------------------
 * APP_STAGE can be:
 *  - 'dev' → development environment
 *  - 'test' → testing environment
 *  - 'production' → production/live environment
 *
 * Default to 'dev' if APP_STAGE is not defined.
 */
process.env.APP_STAGE = process.env.APP_STAGE || 'dev'

const isProduction = process.env.APP_STAGE === 'production'
const isDevelopment = process.env.APP_STAGE === 'dev'
const isTesting = process.env.APP_STAGE === 'test'

/**
 * --------------------------------------------------------
 * Load environment variables from .env files
 * --------------------------------------------------------
 * custom-env allows us to load different .env files depending
 * on the environment:
 *   - .env.dev
 *   - .env.test
 *   - .env.production
 */
if (isDevelopment) {
  loadEnv() // loads .env.dev by default
} else if (isTesting) {
  loadEnv('test') // loads .env.test
}

/**
 * --------------------------------------------------------
 * Zod schema to validate environment variables
 * --------------------------------------------------------
 * Ensures all required environment variables exist and have
 * correct types.
 *
 * Why:
 *  - Prevents runtime errors caused by missing or malformed env vars.
 *  - Makes sure secrets (JWT_SECRET) and configs are correct.
 */
const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),

  APP_STAGE: z.enum(['dev', 'test', 'production']).default('dev'),

  PORT: z.coerce.number().positive().default(3000), // Convert string → number
  DATABASE_URL: z.string().startsWith('postgresql://'), // Must be PostgreSQL URL
  JWT_SECRET: z.string().min(32, 'Must be 32 chars long'), // Strong secret
  JWT_EXPIRES_IN: z.string().default('7d'),
  BCRYPT_ROUNDS: z.coerce.number().min(10).max(20).default(12), // Password hashing rounds
})

export type Env = z.infer<typeof envSchema>
let env: Env

/**
 * --------------------------------------------------------
 * Validate the environment variables
 * --------------------------------------------------------
 * Throws an error and exits process if any env variable
 * is missing or invalid.
 */
try {
  env = envSchema.parse(process.env)
} catch (e) {
  if (e instanceof z.ZodError) {
    console.log('Invalid env var')
    console.error(JSON.stringify(e.flatten().fieldErrors, null, 2))

    e.issues.forEach((err) => {
      const path = err.path.join('.')
      console.log(`${path}: ${err.message}`)
    })

    process.exit(1) // Stop the app if env is invalid
  }

  throw e
}

/**
 * --------------------------------------------------------
 * Environment helper functions
 * --------------------------------------------------------
 * These make it easy to check environment stage in code:
 *   - isProd() → production
 *   - isDev() → development
 *   - isTest() → testing
 */
export const isProd = () => env.APP_STAGE === 'production'
export const isDev = () => env.APP_STAGE === 'dev'
export const isTest = () => env.APP_STAGE === 'test'

/**
 * --------------------------------------------------------
 * Export the validated environment
 * --------------------------------------------------------
 * Now any module can import `env` safely.
 */
export { env }
export default env
