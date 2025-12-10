import * as authService from '../services/auth.service.js'
import { generateJWTToken } from '../utils/generateJWTToken.util.js'

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and password are required',
      })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
      })
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      })
    }

    const user = await authService.registerUser({ name, email, password })

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { user },
    })
  } catch (error) {
    console.error('Register error:', error)

    if (error.message === 'User with this email already exists') {
      return res.status(409).json({
        success: false,
        message: error.message,
      })
    }

    res.status(500).json({
      success: false,
      message: 'Failed to register user',
    })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      })
    }

    const user = await authService.loginUser({ email, password })

    // Generate JWT token
    const token = generateJWTToken(user.id, res)

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: { user },
      token,
    })
  } catch (error) {
    console.error('Login error:', error)

    if (error.message === 'Invalid credentials') {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      })
    }

    res.status(500).json({
      success: false,
      message: 'Failed to login',
    })
  }
}
