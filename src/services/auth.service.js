import bcrypt from 'bcrypt'
import { prisma } from '../config/db.js'

export const registerUser = async ({ name, email, password }) => {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    throw new Error('User with this email already exists')
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  return user
}

export const loginUser = async ({ email, password }) => {
  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    throw new Error('Invalid credentials')
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
    throw new Error('Invalid credentials')
  }

  // Return user without password
  const { password: _, ...userWithoutPassword } = user

  return userWithoutPassword
}
