import { doubleCsrf } from 'csrf-csrf'
import rateLimit from 'express-rate-limit'

export const { doubleCsrfProtection, generateToken } = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET!,
  cookieName: 'XSRF-TOKEN',
  cookieOptions: {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  }
})

export const limiter = rateLimit({
  windowMs: 60 * 1000 * 1,
  max: 30,
  message: 'please try later'
})
