import type { Request, Response, NextFunction } from 'express'

interface CustomError extends Error {
  status?: number
}

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not found - ${req.originalUrl}`) as CustomError
  error.status = 404
  next(error)
}
