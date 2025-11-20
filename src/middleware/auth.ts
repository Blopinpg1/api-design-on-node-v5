import type { Request, Response, NextFunction } from 'express'
import { verifyToken, type JwtPayload } from '../utils/jwt.ts'
import { error } from 'console'

/**
 * Extend Express Request object to include `user`
 * This allows us to attach the decoded JWT payload to the request
 * so it can be accessed in protected routes (req.user).
 */
export interface AuthenticatedRequest extends Request {
  user?: JwtPayload
}

/**
 * Middleware: AuthenticateToken
 * ------------------------------------------
 * Purpose:
 *   Protects routes by checking if a valid JWT token is provided.
 *
 * Process:
 *   1. Read the `Authorization` header (expected format: "Bearer <token>").
 *   2. Extract the token.
 *   3. Verify the token using verifyToken().
 *   4. If valid → attach decoded user payload to req.user and call next().
 *   5. If invalid or missing → return appropriate error response.
 */
export const AuthenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Step 1: Read the Authorization header (case-insensitive)
    const authHeader = req.headers['authorization']

    /**
     * Step 2: Extract the token
     * Example header:
     *    Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR..."
     *
     * authHeader.split(" ") → ["Bearer", "<token>"]
     * Token = second element
     */
    const token = authHeader && authHeader.split(' ')[1]

    // If header is missing or no token is provided → Unauthorized
    if (!token) {
      return res.status(401).json({ error: 'Bad request' }) // 401 = client did not send token
    }

    /**
     * Step 3: Verify JWT token
     * - verifyToken() decodes and validates signature & expiry
     * - If invalid → it will throw error (caught by catch block)
     */
    const payload = await verifyToken(token)

    // Step 4: Attach decoded token payload (user info) to the request object
    req.user = payload
    console.log('Authenticated user:', payload)

    // Step 5: Pass control to next middleware/controller
    next()
  } catch (error) {
    /**
     * If token verification fails (expired, invalid signature, tampered),
     * respond with 403 Forbidden.
     */
    return res.status(403).json({ error: 'Forbidden' })
  }
}
