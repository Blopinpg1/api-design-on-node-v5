import express from 'express'
import authRoutes from './routes/authRoutes.ts'
import userRoutes from './routes/userRoutes.ts'
import habitRoutes from './routes/habitRoutes.ts'

import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import { isTest } from '../env.ts'
import { errorHandler } from './middleware/errorHandler.ts'
import { notFound } from './middleware/404errorHandler.ts'

const app = express()

/**
 * ---------------------------------------------------------
 * Global Middlewares
 * ---------------------------------------------------------
 */

/**
 * Helmet
 * -------
 * Security middleware that sets various HTTP headers to help
 * protect the app from common web vulnerabilities such as:
 *  - XSS attacks
 *  - Clickjacking
 *  - MIME sniffing
 */
app.use(helmet())

/**
 * CORS
 * -----
 * Enables Cross-Origin Resource Sharing.
 * Allows frontend (React, mobile apps, etc.) to talk to this API.
 */
app.use(cors())

/**
 * Parse JSON bodies
 * ------------------
 * Allows Express to correctly understand and parse incoming
 * JSON request bodies (e.g., POST /login with JSON data).
 */
app.use(express.json())

/**
 * Parse URL-encoded bodies (HTML form submissions)
 * --------------------------------------------------
 * extended: true → allows nested objects in form data.
 * Example:
 *   user[name]=bibek  → { user: { name: "bibek" } }
 */
app.use(express.urlencoded({ extended: true }))

/**
 * Morgan (HTTP Logger)
 * ----------------------
 * Logs method, URL, response time, and status code.
 * Example log:
 *   GET /api/users 200 15ms
 *
 * skip: () => isTest()
 *   → prevent logging during automated testing.
 */
app.use(
  morgan('dev', {
    skip: () => isTest(),
  })
)

/**
 * ---------------------------------------------------------
 * Health Check
 * ---------------------------------------------------------
 * Used by deployment services (like Render, Railway, Docker)
 * to verify that the server is alive.
 */
app.get('/health', (req, res) => {
  res.send('ok')
})

/**
 * ---------------------------------------------------------
 * Sample Test Routes (for learning only)
 * ---------------------------------------------------------
 * NOTE: Having two POST routes with the same path is unusual.
 * Only the FIRST one will run unless next() is used.
 *
 * These appear to be practice routes for understanding how
 * routing works in Express.
 */
app.post('/cake', (req, res) => {
  res.send('ok')
})

app.post('/cake', (req, res) => {
  res.send('next')
})

/**
 * ---------------------------------------------------------
 * API Routes
 * ---------------------------------------------------------
 * These routes are split into different folders for modularity.
 * Example endpoint:
 *   POST /api/auth/login
 */
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/habits', habitRoutes)
// More routes (tags, stats, etc.) can be added here

app.use(notFound)

/** * ---------------------------------------------------------
 * Error Handling Middleware
 * ---------------------------------------------------------
 * Catches errors thrown in route handlers and middlewares.
 * Sends structured JSON error responses to clients.
 */

//a special middleware to catch all requests that don't match any defined routes
app.use(errorHandler)

/**
 * Exporting the app
 * ---------------------------------------------------------
 * Export `app` so it can be:
 *  - Used by server.ts to start the HTTP server
 *  - Imported by test frameworks (Vitest/Jest)
 */
export { app }
export default app
