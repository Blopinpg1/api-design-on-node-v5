import { error } from 'console'
import type { Request, Response, NextFunction } from 'express'
import { type ZodSchema, ZodError } from 'zod'

/**
 * validateBody(schema)
 * --------------------
 * Middleware for validating req.body using a Zod schema.
 *
 * Why?
 *   - Ensures the incoming data has correct types & structure.
 *   - Prevents invalid or malicious input from reaching the controllers.
 *
 * Flow:
 *   1. schema.parse(req.body) → validates against the Zod schema.
 *   2. If valid → replace req.body with cleaned/parsed data (Zod sanitizes).
 *   3. If invalid → return a 400 response with detailed validation errors.
 *   4. If unknown error occurs → pass it to global error handler.
 */
export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // ⭐ Zod will validate AND transform (if schema has transforms)
      const validatedData = schema.parse(req.body)

      // Replace body with validated/safe data
      req.body = validatedData

      next()
    } catch (e) {
      // If validation error → extract details & send response
      if (e instanceof ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          details: e.issues.map((err) => ({
            field: err.path.join('.'), // e.g., "email" or "user.name"
            message: err.message,
          })),
        })
      }

      // Other unexpected errors go to error handler
      next(e)
    }
  }
}

/**
 * validateParams(schema)
 * ----------------------
 * Middleware for validating req.params (URL parameters).
 *
 * Example:
 *   GET /users/:id
 *   validateParams(z.object({ id: z.string().uuid() }))
 *
 * Why?
 *   - Prevents invalid IDs, slugs, or route parameters before querying the DB.
 */
export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.params)
      next()
    } catch (e) {
      if (e instanceof ZodError) {
        return res.status(400).json({
          error: 'Invalid params',
          details: e.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        })
      }
      next(e)
    }
  }
}

/**
 * validateQuery(schema)
 * ---------------------
 * Middleware for validating req.query (URL query string).
 *
 * Example:
 *   GET /habits?limit=10&page=2
 *   validateQuery(z.object({ limit: z.number(), page: z.number() }))
 *
 * Why?
 *   - Ensures numeric queries are numbers (not strings)
 *   - Ensures filters/sorting options are valid
 *   - Prevents unsafe queries from reaching your database
 */
export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.query)
      next()
    } catch (e) {
      if (e instanceof ZodError) {
        return res.status(400).json({
          error: 'Invalid query params',
          details: e.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        })
      }

      next(e)
    }
  }
}
