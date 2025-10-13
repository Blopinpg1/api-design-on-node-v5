import { Router } from 'express'
import { z } from 'zod'
import { validateBody, validateParams } from '../middleware/validation.ts'

const createHabitSchema = z.object({
  name: z.string(),
})

const completeParamsSchema = z.object({
  id: z.string().max(3),
})

const router = Router()

router.get('/', (req, res) => {
  res.json({ message: 'habits' })
})
router.get('/:id', (req, res) => {
  res.json({ message: 'got one habbit' })
})

router.post('/', validateBody(createHabitSchema), (req, res) => {
  res.json({ message: 'habit created' }).status(201)
})

router.delete('/:id', (req, res) => {
  res.json({ message: 'habit deleted' })
})

router.post(
  '/:id/complete',
  validateBody(createHabitSchema),
  validateParams(completeParamsSchema),
  (req, res) => {
    res.json({ message: 'habit completed' })
  }
)

export default router
