import { app } from './server.ts'
import { env } from '../env.ts'

/**
 * Starts the Express server.
 *
 * This file is intentionally very small — its only job is to:
 * 1. Import the configured Express `app` from server.ts
 * 2. Start listening on the port defined in environment variables
 *
 * Keeping the server startup separate makes your codebase cleaner,
 * easier to test, and easier to extend later (e.g., WebSockets, workers, etc.).
 */

app.listen(env.PORT, () => {
  // This callback runs once the server is successfully up.
  console.log(`server listening on port ${env.PORT} `)
})
