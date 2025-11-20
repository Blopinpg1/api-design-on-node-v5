import { Router } from 'express'
import { z } from 'zod'
import { validateBody, validateParams } from '../middleware/validation.ts'
import { AuthenticateToken } from '../middleware/auth.ts'
import {
  createHabit,
  getUserHabits,
  updateHabit,
  getHabitById,
  deleteHabit,
} from '../controllers/habitController.ts'

/**
 * --------------------------------------------------------
 * Zod Validation Schemas
 * --------------------------------------------------------
 * Define the structure and rules for incoming requests.
 */

// Schema for creating a new habit
const createHabitSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  frequency: z.string(), // e.g., daily, weekly
  targetCount: z.number().min(1), // must be at least 1
  tagIds: z.array(z.string()).optional(), // optional array of tag IDs
})

// Schema for updating an existing habit
const updateHabitSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  frequency: z.enum(['daily', 'weekly', 'monthly']).optional(),
  targetCount: z.number().int().positive().optional(),
  isActive: z.boolean().optional(), // soft-delete flag
  tagIds: z.array(z.string().uuid()).optional(), // array of valid UUIDs
})

// Schema to validate habit ID in params
const uuidSchema = z.object({
  id: z.uuid('Invalid habit ID format'),
})

// Example schema for completion params (could be refined)
const completeParamsSchema = z.object({
  id: z.string().max(3), // for demonstration, max length 3
})

/**
 * --------------------------------------------------------
 * Initialize Router
 * --------------------------------------------------------
 */
const router = Router()

/**
 * --------------------------------------------------------
 * Authentication Middleware
 * --------------------------------------------------------
 * All routes below this line require the user to be authenticated.
 */
router.use(AuthenticateToken)

/**
 * --------------------------------------------------------
 * CRUD Habit Routes
 * --------------------------------------------------------
 */

// Get all habits for the authenticated user
router.get('/', getUserHabits)

// Update a habit (partial update)
router.patch('/:id', updateHabit)

// Get a single habit by ID
router.get('/:id', getHabitById)

// Update a habit fully, with validation on params and body
router.put(
  '/:id',
  validateParams(uuidSchema), // ensure :id is a valid UUID
  validateBody(updateHabitSchema), // validate request body
  updateHabit
)

// Create a new habit
router.post('/', validateBody(createHabitSchema), createHabit)

// Delete a habit
router.delete('/:id', validateParams(uuidSchema), deleteHabit)

/**
 * --------------------------------------------------------
 * Habit Completion Route
 * --------------------------------------------------------
 * This example route marks a habit as completed.
 */
router.post(
  '/:id/complete',
  validateBody(createHabitSchema), // optional, could use completion-specific schema
  validateParams(completeParamsSchema), // validate ID params
  (req, res) => {
    res.json({ message: 'habit completed' })
  }
)

/**
 * --------------------------------------------------------
 * Tag Relationship Routes (Commented Out)
 * --------------------------------------------------------
 * Example routes for adding/getting habits by tag.
 * Can be enabled once tagController functions exist.
 */
// router.get(
//   '/tag/:tagId',
//   validateParams(z.object({ tagId: z.uuid() })),
//   getHabitsByTag
// )
// router.post(
//   '/:id/tags',
//   validateParams(uuidSchema),
//   validateBody(z.object({ tagIds: z.array(z.uuid()).min(1) })),
//   addTagsToHabit
// )

/**
 * --------------------------------------------------------
 * Export Router
 * --------------------------------------------------------
 * Mount this in app.ts under /api/habits
 */
export default router
