import jwt from 'jsonwebtoken'

export const generateJWTToken = (payload, res) => {
  // Ensure payload is an object, not a string
  const tokenPayload = typeof payload === 'string' ? { id: payload } : payload

  const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  })
  return token
}
