import jwt from 'jsonwebtoken'

export const generateJWTToken = (payload) => {
  // Ensure payload is an object, not a string
  const tokenPayload = typeof payload === 'string' ? { id: payload } : payload

  const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
  return token
}
