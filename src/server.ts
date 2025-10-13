import express from 'express'
import authRoutes from './routes/authRoutes.ts'
import userRoutes from './routes/userRoutes.ts'
import habitRoutes from './routes/habitRoutes.ts'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import { json } from 'zod'
import { ppid } from 'process'
import { isTest } from '../env.ts'
const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
  morgan('dev', {
    skip: () => isTest(),
  })
)

app.get('/health', (req, res) => {
  //   res.json({ message: 'hello', fuck: 'you' }).status(200)
  res.send('<h1>HELLO</h>')
})

app.post('/cake', (req, res) => {
  res.send('ok')
})

app.post('/cake', (req, res) => {
  res.send('next')
})

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/habits', habitRoutes)

export { app }
export default app
