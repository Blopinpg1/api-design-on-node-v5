import bcrypt from 'bcrypt'
import env from '../../env.ts'

/**
 * hashPassword(password)
 * -----------------------
 * Creates a secure hashed version of a plaintext password.
 *
 * How it works:
 *   - bcrypt.hash() applies a hashing algorithm + salt.
 *   - env.BCRYPT_ROUNDS controls the "salt rounds"
 *     (higher = more secure but slower).
 *
 * Why needed:
 *   - Never store plaintext passwords.
 *   - Even if the database is leaked, hashed passwords are extremely
 *     hard to reverse.
 *
 * Returns:
 *   A hashed password string (to store in the database).
 */
export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, env.BCRYPT_ROUNDS)
}

/**
 * comparePasswords(password, hashedPassword)
 * ------------------------------------------
 * Verifies if a user-entered password matches the hashed password stored
 * in the database.
 *
 * Flow:
 *   - bcrypt.compare() hashes the plain password internally
 *     and checks if it matches the stored hash.
 *
 * Why needed:
 *   - For login authentication.
 *   - The server never needs to decrypt passwords.
 *
 * Returns:
 *   true  → password is correct
 *   false → incorrect password
 */
export const comparePasswords = async (
  password: string,
  hashedPassword: string
) => {
  return bcrypt.compare(password, hashedPassword)
}
