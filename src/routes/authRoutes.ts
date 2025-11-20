import { Router } from 'express'
import { login, register } from '../controllers/authController.ts'
import { validateBody } from '../middleware/validation.ts'
import { insertUserSchema } from '../db/schema.ts'
import { z } from 'zod'

/**
 * --------------------------------------------------------
 * Login Schema
 * --------------------------------------------------------
 * Zod validation schema for user login.
 * Ensures:
 *  - `email` is a valid email
 *  - `password` is at least 6 characters
 *
 * This schema will be used to validate incoming POST /login requests.
 */
const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6, 'password must be at least 6 characters long'),
})

/**
 * --------------------------------------------------------
 * Express Router
 * --------------------------------------------------------
 * Used to define routes under `/api/auth`.
 * Keeps routes modular and maintainable.
 */
const router = Router()

/**
 * --------------------------------------------------------
 * POST /register
 * --------------------------------------------------------
 * 1. Uses `validateBody(insertUserSchema)` middleware:
 *    - Validates incoming request body against the `insertUserSchema`
 *    - Ensures required fields like email, username, and password are valid
 * 2. Calls `register` controller if validation passes
 */
router.post('/register', validateBody(insertUserSchema), register)

/**
 * --------------------------------------------------------
 * POST /login
 * --------------------------------------------------------
 * 1. Uses `validateBody(loginSchema)` middleware:
 *    - Validates login request (email + password)
 * 2. Calls `login` controller if validation passes
 */
router.post('/login', validateBody(loginSchema), login)

/**
 * --------------------------------------------------------
 * Export
 * --------------------------------------------------------
 * Export router so it can be mounted in app.ts under `/api/auth`
 */
export default router
