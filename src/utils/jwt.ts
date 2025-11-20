import { SignJWT, jwtVerify } from 'jose'
import { createSecretKey } from 'node:crypto'
import env from '../../env.ts'

/**
 * JwtPayload
 * ----------
 * The shape of the data we embed inside the JWT.
 *
 * Notes:
 *  - JWT should contain only NON-sensitive information.
 *  - Avoid storing passwords or anything private here.
 */
export interface JwtPayload extends Record<string, unknown> {
  id: string
  email: string
  username: string
}

/**
 * generateToken(payload)
 * -----------------------
 * Creates a signed JWT token using the JOSE library.
 *
 * How it works:
 *  1. Convert the secret string into a cryptographic SecretKey.
 *  2. Use SignJWT to create a token with:
 *      - Protected header (algorithm HS256)
 *      - Issued-at timestamp (iat)
 *      - Expiration time ('2h' → token valid for 2 hours)
 *  3. Return the signed JWT string.
 *
 * Why JWT?
 *  - Used for stateless authentication.
 *  - Server does NOT need to store session data.
 *
 * Returns:
 *   A signed token that the client will store (cookies/local storage).
 */
export const generateToken = (payload: JwtPayload): Promise<string> => {
  const secret = env.JWT_SECRET
  const secretKey = createSecretKey(Buffer.from(secret, 'utf-8'))

  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' }) // Algorithm used for signing
    .setIssuedAt() // Adds 'iat' timestamp
    .setExpirationTime('2h') // Token expires in 2 hours
    .sign(secretKey) // Sign with the secret key
}

/**
 * verifyToken(token)
 * --------------------
 * Validates a JWT and returns the decoded payload.
 *
 * What happens:
 *  1. Convert JWT_SECRET into a crypto SecretKey.
 *  2. Use jwtVerify() to:
 *      - Confirm signature is valid
 *      - Confirm token has not expired
 *      - Extract the payload
 *
 * Why needed:
 *  - Used in authentication middleware to check if a user is logged in.
 *
 * Throws:
 *  - Error if signature is invalid
 *  - Error if token is expired
 *
 * Returns:
 *   The decoded payload (id, email, username).
 */
export const verifyToken = async (token: string): Promise<JwtPayload> => {
  const secretKey = createSecretKey(env.JWT_SECRET, 'utf-8')
  const { payload } = await jwtVerify(token, secretKey)
  return payload as JwtPayload
}
