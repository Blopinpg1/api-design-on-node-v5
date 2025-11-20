import type { NextFunction, Request, Response } from 'express'
import { env } from '../../env.ts'
import type { A } from 'vitest/dist/chunks/environment.d.cL3nLXbE.js'

export class APIError extends Error {
  status: number
  name: string
  message: string
  constructor(name: string, status: number, message: string) {
    super()
    this.status = status
    this.name = name
    this.message = message
  }
}

export const errorHandler = (
  err: APIError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err.stack)
  let status = err.status || 500
  let message = err.message || 'Internal Server Error'

  if (err.name === 'ValidationError') {
    status = 400
    message = err.message
  }
  if (err.name === 'UnauthorizedError') {
    status = 401
    message = 'Unauthorized'
  }
  return res.status(status).json({
    error: message,
    ...(env.APP_STAGE === 'dev' && { stack: err.stack, details: err.message }),
  })
}
