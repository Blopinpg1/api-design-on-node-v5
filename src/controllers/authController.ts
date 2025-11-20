import type { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { eq } from 'drizzle-orm'
import { db } from '../db/connection.ts'
import { users, type NewUser, type User } from '../db/schema.ts'
import { generateToken } from '../utils/jwt.ts'
import { hashPassword, comparePasswords } from '../utils/password.ts'

export const register = async (
  req: Request<any, any, NewUser>,
  res: Response
) => {
  try {
    const { email, username, password, firstName, lastName } = req.body
    const hashedPassword = await hashPassword(password)
    // Create user in database
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        username,
        password: hashedPassword, // Store hash, not plain text!
        firstName,
        lastName,
      })
      .returning({
        id: users.id,
        email: users.email,
        username: users.username,
        firstName: users.firstName,
        lastName: users.lastName,
        createdAt: users.createdAt,
      })
    // Generate JWT for auto-login
    const token = await generateToken({
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
    })
    res.status(201).json({
      message: 'User created successfully',
      user: newUser,
      token, // User is logged in immediately
    })
  } catch (error) {
    console.error('Error during registration:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    })
    // const [user] = await db.select().from(users).where(eq(users.email, email))
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' }) // entered email not found or user not found
    }
    const isValidatedPassword = await comparePasswords(password, user.password)
    if (!isValidatedPassword) {
      return res.status(401).json({ error: 'Invalid credentials' }) // email is right but password is wrong , might be the user entered wrong password or an attacker trying to guess the password
    }
    const token = await generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
    })
    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
      },
      token,
    })
  } catch (error) {
    console.error('loging error:', error)
    res.status(500).json({ error: 'Failed to login ' })
  }
}
