import { Router } from 'express'

const router = Router()

router.post('/register', (req, res) => {
  res.status(201).json({ message: 'user signed up' })
})
router.post('/login', (req, res) => {
  res.status(201).json({ message: 'user logged in' })
})

export default router
